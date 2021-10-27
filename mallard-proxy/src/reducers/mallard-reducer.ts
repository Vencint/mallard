import {MallardEvent} from "../events/mallard-event";
import {MallardPathInterface} from "../models/mallard-path.interface";
import {MallardCache} from "../cache/mallard-cache";

/**
 * This class provides functions to update preferences regarding the mallard proxy.
 */
export class MallardReducer {

    constructor(private mallardCache: MallardCache) {
    }

    /**
     * Updates the path preferences for a certain server in the cache.
     * @param pathEvent event payload containing the id of the server that needs to be updated and the new path.
     * @return promise that resolves once the update has been completed
     */
    public updatePath = (pathEvent: MallardEvent<MallardPathInterface>): Promise<unknown> =>
        this.mallardCache.setRequestOption(pathEvent.payload.id, 'path', pathEvent.payload.path || '');
}