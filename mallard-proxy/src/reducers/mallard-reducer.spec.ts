import {MallardCache} from "../cache/mallard-cache";
import {MallardReducer} from "./mallard-reducer";
import {MallardEvent} from "../events/mallard-event";
import {MallardPathInterface} from "../models/mallard-path.interface";
import {RequestOptions} from "http";

describe('MallardReducer', () => {

    describe('updatePath', () => {

        it('should save request options', (done) => {
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
                setRequestOption: (id, key, value) => new Promise<number>(resolve => resolve(1))
            };
            const mallardCacheSetRequestOptionsSpy = jest.spyOn(mallardCache, 'setRequestOption');
            const mallardReducer = new MallardReducer(mallardCache);

            mallardReducer
                .updatePath(mallardEvent)
                .then(() => {
                    expect(mallardCacheSetRequestOptionsSpy).toHaveBeenCalledTimes(1);
                    expect(mallardCacheSetRequestOptionsSpy).toHaveBeenCalledWith(id, 'path', requestOptions.path);
                    done();
                })
                .catch(done);
        });

    });

})