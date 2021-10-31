import http, {ClientRequest, IncomingMessage, RequestOptions, ServerResponse} from "http";
import {MallardProxy} from "./mallard-proxy";
import {MallardActualProcessor} from "../processors/mallard-actual-processor";
import {MallardDuplicatesProcessor} from "../processors/mallard-duplicates-processor";

jest.mock('http', () => ({
    request: jest.fn()
}));

describe('MallardProxy', () => {

    describe('handleRequest', () => {

        let mockHttpRequest = http.request as jest.Mock;
        mockHttpRequest.mockReturnValue(<ClientRequest>{
            on(event: "abort", listener: () => void): ClientRequest {
                return this;
            },
            end(cb?: () => void): void {
            }
        });

        it('should execute an http request with request options returned by the processor', (done) => {
            const requestOptions = <RequestOptions>{path: '/path'};
            const mallardActualProcessor = <MallardActualProcessor>{
                process: (options: RequestOptions): Promise<RequestOptions> => new Promise<RequestOptions>(resolve => resolve(requestOptions))
            };
            const mallardDuplicatesProcessor = <MallardDuplicatesProcessor>{
                process: (options: RequestOptions): Promise<RequestOptions[]> => new Promise<RequestOptions[]>(resolve => resolve([]))
            }
            const mallardProxy = new MallardProxy(mallardActualProcessor, mallardDuplicatesProcessor);

            mallardProxy.handleRequest(<IncomingMessage>{}, <ServerResponse>{
                write: (chunk: any, callback?: (error: (Error | null | undefined)) => void): boolean => true,
                end: (cb?: () => void) => {
                }
            })
                .then(() => {
                    expect(mockHttpRequest).toHaveBeenCalledTimes(1);
                    expect(mockHttpRequest).toHaveBeenCalledWith(requestOptions, expect.any(Function));
                    done();
                })
                .catch(done);
        });

    });

});