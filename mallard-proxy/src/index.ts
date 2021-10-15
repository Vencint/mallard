import Express from 'express'
import {MallardProxy} from "./proxy/mallard-proxy";
import {MallardProxyEvents} from "./events/mallard-proxy-events";
import {MallardProxyEventEmitter} from "./events/mallard-proxy-event-emitter";

const app = Express()
const port = process.env.MALLARD_PORT || 6338

const mallardProxy = new MallardProxy();

app.all('/**', mallardProxy.handleProxyRequest)


app.listen(port, () => {
    console.info(`INFO: Mallard is listening on localhost:${port}`)
})

MallardProxyEventEmitter.getInstance().emit(MallardProxyEvents.start)
