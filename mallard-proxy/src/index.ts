/**
 * This file initializes the proxy server and binds the {@link MallardProxy} to it.
 * It is also a kind of ioc container as all needed objects are essentially created here.
 */

import * as http from "http";
import {MallardProxy} from "./proxy/mallard-proxy";
import {MallardReducer} from "./reducers/mallard-reducer";
import {MallardEmitter} from "./events/mallard-emitter";
import {MallardEventNamesEnum} from "./events/mallard-event-names.enum";
import {MallardEvent} from "./events/mallard-event";
import {MallardPathInterface} from "./models/mallard-path.interface";
import {MallardProcessor} from "./processors/mallard-processor";
import {MallardCache} from "./cache/mallard-cache";

const PORT = process.env.MALLARD_PORT || 6338

const mallardEmitter = new MallardEmitter();
const mallardCache = new MallardCache();
const mallardReducer = new MallardReducer(mallardCache);
const mallardProcessor = new MallardProcessor(1, mallardCache);
const mallardProxy = new MallardProxy(mallardProcessor);

http
    .createServer(mallardProxy.handleRequest)
    .listen(PORT, () => {
        console.info(`Mallard is listening on localhost:${PORT}`);
    });

mallardEmitter
    .on(MallardEventNamesEnum.path, mallardReducer.updatePath);

mallardEmitter
    .emit(MallardEventNamesEnum.path, <MallardEvent<MallardPathInterface>>{
        payload: {
            id: 1,
            path: '/v1/test1'
        }
    });