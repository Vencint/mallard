import {MallardActualProcessor} from "./mallard-actual-processor";
import {MallardCache} from "../cache/mallard-cache";
import {RequestOptions} from "http";
import {MallardDuplicatesProcessor} from "./mallard-duplicates-processor";

describe('MallardProcessor', () => {

    describe('process', () => {

        const ids = ['0', '1'];
        const requestOptions = <RequestOptions>{
            host: 'host',
            port: 0,
            path: '/path'
        };

        it('should return an empty array if not duplicates are set', (done) => {
            const mallardCache = <MallardCache>{
                getDuplicates: () => new Promise<string[]>(resolve => resolve([])),
                getRequestOptions: id => new Promise((resolve, reject) => reject())
            };
            const mallardProcessor = new MallardDuplicatesProcessor(mallardCache);
            const expectedRequestOptions: RequestOptions[] = [];

            mallardProcessor.process(requestOptions)
                .then(actualRequestOptions => {
                    expect(actualRequestOptions).toEqual(expectedRequestOptions);
                    done();
                })
                .catch(done);
        });

        it('should update hosts if preferences are set', (done) => {
            const newHosts = ['new.host1', 'new.host2'];
            const mallardCache = <MallardCache>{
                getDuplicates: () => new Promise<string[]>(resolve => resolve(ids)),
                getRequestOptions: (id: string) => new Promise(resolve => resolve({host: newHosts[parseInt(id)]}))
            };
            const mallardProcessor = new MallardDuplicatesProcessor(mallardCache);
            const expectedRequestOptions = [{...requestOptions}, {...requestOptions}];
            expectedRequestOptions[0].host = newHosts[0];
            expectedRequestOptions[1].host = newHosts[1];

            mallardProcessor.process(requestOptions)
                .then(actualRequestOptions => {
                    expect(actualRequestOptions).toEqual(expectedRequestOptions);
                    done();
                })
                .catch(done);
        });

        it('should update ports if preferences are set', (done) => {
            const newPorts = [10, 20];
            const mallardCache = <MallardCache>{
                getDuplicates: () => new Promise<string[]>(resolve => resolve(ids)),
                getRequestOptions: (id: string) => new Promise(resolve => resolve({port: newPorts[parseInt(id)]}))
            };
            const mallardProcessor = new MallardDuplicatesProcessor(mallardCache);
            const expectedRequestOptions = [{...requestOptions}, {...requestOptions}];
            expectedRequestOptions[0].port = newPorts[0];
            expectedRequestOptions[1].port = newPorts[1];

            mallardProcessor.process(requestOptions)
                .then(actualRequestOptions => {
                    expect(actualRequestOptions).toEqual(expectedRequestOptions);
                    done();
                })
                .catch(done);
        });

        it('should update paths if preferences are set', (done) => {
            const newPaths = ['/new/path', '/new{0}/path'];
            const mallardCache = <MallardCache>{
                getDuplicates: () => new Promise<string[]>(resolve => resolve(ids)),
                getRequestOptions: (id: string) => new Promise(resolve => resolve({path: newPaths[parseInt(id)]}))
            };
            const mallardProcessor = new MallardDuplicatesProcessor(mallardCache);
            const expectedRequestOptions = [{...requestOptions}, {...requestOptions}];
            expectedRequestOptions[0].path = newPaths[0];
            expectedRequestOptions[1].path = '/new/path/path';

            mallardProcessor.process(requestOptions)
                .then(actualRequestOptions => {
                    expect(actualRequestOptions).toEqual(expectedRequestOptions);
                    done();
                })
                .catch(done);
        });

    });

});