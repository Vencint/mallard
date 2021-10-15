import EventEmitter from "events";

export class MallardProxyEventEmitter extends EventEmitter {
    private static instance: MallardProxyEventEmitter = new MallardProxyEventEmitter();

    public static getInstance(): MallardProxyEventEmitter {
        return this.instance;
    }

    private constructor() {
        super();
    }
}