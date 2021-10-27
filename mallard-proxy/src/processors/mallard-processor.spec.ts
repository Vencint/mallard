import {MallardProcessor} from "./mallard-processor";
import {MallardCache} from "../cache/mallard-cache";
import {RequestOptions} from "http";

describe('MallardProcessor', () => {

    describe('process', () => {

        const id = 0;
        const requestOptions = <RequestOptions>{
            host: 'host',
            port: 0,
            path: '/path'
        };

        it('should not change request options when no preferences are set', (done) => {
            const mallardCache = <MallardCache>{
                getRequestOptions: (id: number) => new Promise(resolve => resolve(null))
            };
            const mallardProcessor = new MallardProcessor(id, mallardCache);
            const mallardCacheGetRequestOptionsSpy = jest.spyOn(mallardCache, 'getRequestOptions');
            const expectedRequestOptions = {...requestOptions};

            mallardProcessor.process(requestOptions)
                .then(actualRequestOptions => {
                    expect(actualRequestOptions).toEqual(expectedRequestOptions);
                    expect(mallardCacheGetRequestOptionsSpy).toHaveBeenCalledTimes(1);
                    expect(mallardCacheGetRequestOptionsSpy).toHaveBeenCalledWith(id);
                    done();
                })
                .catch(done);
        });

        it('should update host if preferences are set', (done) => {
            const newHost = 'new.host';
            const mallardCache = <MallardCache>{
                getRequestOptions: (id: number) => new Promise(resolve => resolve({host: newHost}))
            };
            const mallardProcessor = new MallardProcessor(id, mallardCache);
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
                getRequestOptions: (id: number) => new Promise(resolve => resolve({port: newPort}))
            };
            const mallardProcessor = new MallardProcessor(id, mallardCache);
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
                getRequestOptions: (id: number) => new Promise(resolve => resolve({path: '/new{0}'}))
            };
            const mallardProcessor = new MallardProcessor(id, mallardCache);
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
                getRequestOptions: (id: number) => new Promise(resolve => resolve({path: newPath}))
            };
            const mallardProcessor = new MallardProcessor(id, mallardCache);
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