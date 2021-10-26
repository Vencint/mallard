import {MallardCache} from "../cache/mallard-cache";
import {MallardReducer} from "./mallard-reducer";
import {MallardEvent} from "../events/mallard-event";
import {MallardPathInterface} from "../models/mallard-path.interface";
import {RequestOptions} from "http";

describe('MallardReducer', () => {

    describe('updatePath', () => {

        it('should save new request options if none are present yet', (done) => {
            const id = 0;
            const requestOptions = <RequestOptions>{
                path: 'path'
            };
            const mallardEvent = <MallardEvent<MallardPathInterface>>{
                payload: {
                    id: id,
                    path: requestOptions.path
                }
            };
            const mallardCache = <MallardCache>{
                getRequestOptions: id => new Promise(resolve => resolve(null)),
                setRequestOptions: (id, newRequestOptions) => new Promise<unknown>(resolve => resolve(undefined))
            };
            const mallardCacheSetRequestOptionsSpy = jest.spyOn(mallardCache, 'setRequestOptions');
            const mallardReducer = new MallardReducer(mallardCache);

            mallardReducer
                .updatePath(mallardEvent)
                .then(() => {
                    expect(mallardCacheSetRequestOptionsSpy).toHaveBeenCalledTimes(1);
                    expect(mallardCacheSetRequestOptionsSpy).toHaveBeenCalledWith(id, requestOptions);
                    done();
                })
                .catch(done);
        });

        it('should save new request options if an error occurred retrieving the cached options', (done) => {
            const id = 0;
            const requestOptions = <RequestOptions>{
                path: 'path'
            };
            const mallardEvent = <MallardEvent<MallardPathInterface>>{
                payload: {
                    id: id,
                    path: requestOptions.path
                }
            };
            const mallardCache = <MallardCache>{
                getRequestOptions: id => new Promise((resolve, reject) => reject('error')),
                setRequestOptions: (id, newRequestOptions) => new Promise<unknown>(resolve => resolve(undefined))
            };
            const mallardCacheSetRequestOptionsSpy = jest.spyOn(mallardCache, 'setRequestOptions');
            const mallardReducer = new MallardReducer(mallardCache);

            mallardReducer
                .updatePath(mallardEvent)
                .then(() => {
                    expect(mallardCacheSetRequestOptionsSpy).toHaveBeenCalledTimes(1);
                    expect(mallardCacheSetRequestOptionsSpy).toHaveBeenCalledWith(id, requestOptions);
                    done();
                })
                .catch(done);
        });

        it('should update request options if cached options already exist', (done) => {
            const id = 0;
            const presetRequestOptions = <RequestOptions>{
                host: 'host',
                path: '/path'
            };
            const mallardEvent = <MallardEvent<MallardPathInterface>>{
                payload: {
                    id: id,
                    path: '/new/path'
                }
            };
            const updatedRequestOptions = {...presetRequestOptions, path: mallardEvent.payload.path};
            const mallardCache = <MallardCache>{
                getRequestOptions: id => new Promise(resolve => resolve(presetRequestOptions)),
                setRequestOptions: (id, newRequestOptions) => new Promise<unknown>(resolve => resolve(undefined))
            };
            const mallardCacheSetRequestOptionsSpy = jest.spyOn(mallardCache, 'setRequestOptions');
            const mallardReducer = new MallardReducer(mallardCache);

            mallardReducer
                .updatePath(mallardEvent)
                .then(() => {
                    expect(mallardCacheSetRequestOptionsSpy).toHaveBeenCalledTimes(1);
                    expect(mallardCacheSetRequestOptionsSpy).toHaveBeenCalledWith(id, updatedRequestOptions);
                    done();
                })
                .catch(done);
        });

    });

})