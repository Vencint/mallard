import {IncomingMessage, RequestOptions, ServerResponse} from "http";
import * as http from "http";
import {MallardActualProcessor} from "../processors/mallard-actual-processor";
import {MallardDuplicatesProcessor} from "../processors/mallard-duplicates-processor";

/**
 * This class takes care of incoming requests. It processes them with the help of processors and the directs them to an
 * actual and multiple duplicates. Afterwards it returns the result received by the actual and compares the result with
 * those of the duplicates.
 */
export class MallardProxy {

    /**
     * @see MallardProxy
     * @param actualProcessor processor to process request options for actual server
     * @param duplicatesProcessor processor to process request options for potential duplicate servers
     */
    constructor(
        private actualProcessor: MallardActualProcessor,
        private duplicatesProcessor: MallardDuplicatesProcessor
    ) {
    }

    /**
     * Modifies the request options and sends new requests to the actual and also duplicates. It then sends back the
     * result from the actual to the caller.
     * @param req request to process
     * @param res response to send to the caller
     */
    public handleRequest = (req: IncomingMessage, res: ServerResponse): Promise<void> => {
        const actual = this.actualProcessor
            .process(MallardProxy.createRequestOptions(req))
            .then(httpRequest);

        const duplicates = this.duplicatesProcessor
            .process(MallardProxy.createRequestOptions(req))
            .then(httpRequests);

        function httpRequest(requestOption: RequestOptions): void {
            http
                .request(requestOption, httpRes => {
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

        function httpRequests(requestOptions: RequestOptions[]): void {
            requestOptions.forEach(requestOption => {
                http
                    .request(requestOption, httpRes => {
                        let response = '';
                        httpRes.on('data', chunk => response += chunk);
                        httpRes.on('end', () => {
                            // TODO
                        });
                    })
                    .on('error', console.error)
                    .end();
            });
        }

        return Promise.all([actual, duplicates]).then();
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