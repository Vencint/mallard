import {MallardEvent} from "../events/mallard-event";
import {MallardPathInterface} from "../models/mallard-path.interface";
import {MallardCache} from "../cache/mallard-cache";
import {RequestOptions} from "http";

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
        this.mallardCache.getRequestOptions(pathEvent.payload.id)
            .catch(err => {
                console.error(err);
                return null;
            })
            .then((preferences: RequestOptions | null) =>
                !preferences ?
                    <RequestOptions>{path: pathEvent.payload.path} :
                    {...preferences, path: pathEvent.payload.path}
            )
            .then((newPreferences: RequestOptions) => this.mallardCache.setRequestOptions(pathEvent.payload.id, newPreferences));

}