import {MallardActualProcessor} from "./mallard-actual-processor";
import {MallardCache} from "../cache/mallard-cache";
import {RequestOptions} from "http";

describe('MallardProcessor', () => {

    describe('process', () => {

        const id = '1';
        const requestOptions = <RequestOptions>{
            host: 'host',
            port: 0,
            path: '/path'
        };

        it('should throw an error if no actual was found', (done) => {
            const mallardCache = <MallardCache>{
                getActual: () => new Promise<null>(resolve => resolve(null))
            };
            const mallardProcessor = new MallardActualProcessor(mallardCache);
            const expectedError = new Error('No actual id found.');

            mallardProcessor.process(requestOptions)
                .catch((error: Error) => {
                    expect(error).toEqual(expectedError);
                    done();
                })
                .catch(done);
        });

        it('should throw an error if no preferences were found', (done) => {
            const mallardCache = <MallardCache>{
                getActual: () => new Promise<string>(resolve => resolve(id)),
                getRequestOptions: (id: string) => new Promise(resolve => resolve(null))
            };
            const mallardProcessor = new MallardActualProcessor(mallardCache);
            const mallardCacheGetRequestOptionsSpy = jest.spyOn(mallardCache, 'getRequestOptions');
            const expectedError = new Error('No actual preferences found.');

            mallardProcessor.process(requestOptions)
                .catch((error: Error) => {
                    expect(error).toEqual(expectedError)
                    expect(mallardCacheGetRequestOptionsSpy).toHaveBeenCalledTimes(1);
                    expect(mallardCacheGetRequestOptionsSpy).toHaveBeenCalledWith(id);
                    done();
                })
                .catch(done);
        });

        it('should update host if preferences are set', (done) => {
            const newHost = 'new.host';
            const mallardCache = <MallardCache>{
                getActual: () => new Promise<string>(resolve => resolve(id)),
                getRequestOptions: (id: string) => new Promise(resolve => resolve({host: newHost}))
            };
            const mallardProcessor = new MallardActualProcessor(mallardCache);
            const expectedRequestOptions = {...requestOptions, host: newHost};

            mallardProcessor.process(requestOptions)
                .then(actualRequestOptions => {
                    expect(actualRequestOptions).toEqual(expectedRequestOptions);
                    done();
                })
                .catch(done);
        });

        it('should update port if preferences are set', (done) => {
            const newPort = '1';
            const mallardCache = <MallardCache>{
                getActual: () => new Promise<string>(resolve => resolve(id)),
                getRequestOptions: (id: string) => new Promise(resolve => resolve({port: newPort}))
            };
            const mallardProcessor = new MallardActualProcessor(mallardCache);
            const expectedRequestOptions = {...requestOptions, port: newPort};

            mallardProcessor.process(requestOptions)
                .then(actualRequestOptions => {
                    expect(actualRequestOptions).toEqual(expectedRequestOptions);
                    done();
                })
                .catch(done);
        });

        it('should update path if preferences are set', (done) => {
            const mallardCache = <MallardCache>{
                getActual: () => new Promise<string>(resolve => resolve(id)),
                getRequestOptions: (id: string) => new Promise(resolve => resolve({path: '/new{0}'}))
            };
            const mallardProcessor = new MallardActualProcessor(mallardCache);
            const expectedRequestOptions = {...requestOptions, path: '/new/path'};

            mallardProcessor.process(requestOptions)
                .then(actualRequestOptions => {
                    expect(actualRequestOptions).toEqual(expectedRequestOptions);
                    done();
                })
                .catch(done);
        });

        it('should overwrite path if preferences are set', (done) => {
            const newPath = '/new';
            const mallardCache = <MallardCache>{
                getActual: () => new Promise<string>(resolve => resolve(id)),
                getRequestOptions: (id: string) => new Promise(resolve => resolve({path: newPath}))
            };
            const mallardProcessor = new MallardActualProcessor(mallardCache);
            const expectedRequestOptions = {...requestOptions, path: newPath};

            mallardProcessor.process(requestOptions)
                .then(actualRequestOptions => {
                    expect(actualRequestOptions).toEqual(expectedRequestOptions);
                    done();
                })
                .catch(done);
        });

    });

});