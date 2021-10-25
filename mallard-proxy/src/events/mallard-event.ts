/**
 * All events regarding the mallard proxy should send an instantiation of this class if they want to convey payload.
 */
export class MallardEvent<P> {
    constructor(readonly payload: P) {
    }
}
