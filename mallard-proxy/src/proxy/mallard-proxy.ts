import {IncomingMessage, RequestOptions, ServerResponse} from "http";
import * as http from "http";
import {MallardProcessor} from "../processors/mallard-processor";

/**
 * This class takes care of incoming requests. It processes them with the help of processors and the directs them to an
 * actual and multiple duplicates. Afterwards it returns the result received by the actual and compares the result with
 * those of the duplicates.
 */
export class MallardProxy {

    /**
     * @see MallardProxy
     * @param actualProcessor initial processor for actual to begin with; the proxy cannot start without an actual
     */
    constructor(private actualProcessor: MallardProcessor) {
    }

    /**
     * Modifies the request options and sends new requests to the actual and also duplicates. It then sends back the
     * result from the actual to the caller.
     * @param req request to process
     * @param res response to send to the caller
     */
    public handleRequest = (req: IncomingMessage, res: ServerResponse): Promise<void> => {
        return this.actualProcessor
            .process(MallardProxy.createRequestOptions(req))
            .then(httpRequest);

        function httpRequest(requestOptions: RequestOptions) {
            http
                .request(requestOptions, httpRes => {
                    let response = '';
                    httpRes.on('data', chunk => response += chunk);
                    httpRes.on('end', () => {
                        res.write(response);
                        res.end();
                    });
                })
                .on('error', console.error)
                .end();
        }
    }

    /**
     * Converts {@link IncomingMessage} to {@link RequestOptions}.
     * @param req incoming message to be converted to request options
     * @return request options created from incoming message
     * @private
     */
    private static createRequestOptions(req: IncomingMessage): RequestOptions {
        return {
            path: req.url
        };
    }

}