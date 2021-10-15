import {MallardDbService} from "../db/mallard-db-service";
import {Server} from "../models/Server";
import {MallardProxyEvents} from "../events/mallard-proxy-events";
import * as http from "http";
import {Request, Response} from "express";
import {RequestOptions} from "http";
import {MallardProxyEventEmitter} from "../events/mallard-proxy-event-emitter";

export class MallardProxy {
    private mallardDbService: MallardDbService;

    private mallardProxyActive: boolean = false;
    private actual: RequestOptions | undefined = undefined;
    private duplicates: RequestOptions[] = [];

    constructor() {
        this.mallardDbService = MallardDbService.getInstance();

        MallardProxyEventEmitter.getInstance().on(MallardProxyEvents.start, this.startMallardProxy);
        MallardProxyEventEmitter.getInstance().on(MallardProxyEvents.end, this.endMallardProxy);
    }

    /**
     * Handles a request to the mallard proxy, duplicates it and then forwards them.
     * @param clientRequest request object
     * @param clientResponse response object
     */
    public handleProxyRequest = (clientRequest: Request, clientResponse: Response): void => {
        if (this.actual === undefined) {
            console.log('no actual');
            clientResponse.end();
            return;
        }

        if (!this.mallardProxyActive) {
            clientResponse.status(503).send('Mallard is currently not available.');
            return;
        }

        console.debug(`DEBUG: request '${clientRequest.url}' - actual '${this.actual.path}' - duplicates '${this.duplicates.map(d => d.path)}'`);

        this.doRequest(this.actual, this.actual.path + clientRequest.url, res => clientResponse.send(res));
        this.duplicates.forEach(
            duplicate => this.doRequest(duplicate, duplicate.path + clientRequest.url, () => {
            })
        );
    }

    /**
     * Initializes the mallard proxy by setting mallardProxyActive to true.
     */
    private startMallardProxy = (): void => {
        console.log('caught event');
        this.initClientOptions()
            .then(() => {
                this.mallardProxyActive = true;
            })
            .catch(() => {
                this.mallardProxyActive = false;
            });
    }

    /**
     * Terminates the mallard proxy by setting mallardProxyActive to false.
     */
    private endMallardProxy = (): void => {
        this.mallardProxyActive = false;
    }

    /**
     * Initializes everything needed for a running mallard proxy:
     *  - actual: the server to which forward requests
     *  - duplicates: list of servers where to send the exact same requests for testing purposes
     */
    private initClientOptions = (): Promise<void> => {
        return this.mallardDbService.findAllClientOptions()
            .then((clientOptions: Server[]) => {
                this.actual = clientOptions.find((clientOptionDbModel: Server) => clientOptionDbModel.isActual)?.options;
                if (this.actual === undefined) throw new Error('There is no server to forward requests to.');

                this.duplicates = clientOptions
                    .filter((clientOptionDbModel: Server) => !clientOptionDbModel.isActual)
                    .map((clientOptionsDbModel: Server) => clientOptionsDbModel.options);
                if (this.duplicates.length === 0) console.info('Starting mallard with no duplicates.');
            });
    }

    /**
     * Creates an http request.
     * @param options parameters for request
     * @param path path to endpoint
     * @param callback function to be called on the request's response
     */
    private doRequest = (options: RequestOptions, path: string, callback: (res: string) => any): void => {
        http
            .request({...options, path: path}, res => {
                let response = ''
                res.on('data', chunk => response += chunk)
                res.on('end', () => callback(response))
            })
            .on('error', console.error)
            .end()
    }
}