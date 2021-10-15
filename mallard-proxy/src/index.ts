import {MallardProxy} from "./proxy/mallard-proxy";
import {MallardProxyEvents} from "./events/mallard-proxy-events";
import {MallardProxyEventEmitter} from "./events/mallard-proxy-event-emitter";
import * as http from "http";

const PORT = process.env.MALLARD_PORT || 6338

const mallardProxy = new MallardProxy();

http
    .createServer(mallardProxy.handleProxyRequest)
    .listen(PORT, () => {
        console.info(`Mallard is listening on localhost:${PORT}`);
    })

MallardProxyEventEmitter.getInstance().emit(MallardProxyEvents.start)
