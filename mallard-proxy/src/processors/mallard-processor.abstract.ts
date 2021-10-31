import {MallardCache} from "../cache/mallard-cache";
import {RequestOptions} from "http";

export abstract class MallardProcessorAbstract {

    /**
     * @see MallardActualProcessor
     * @param mallardCache cache from where to get modifications that need to be applied to the request options when
     * processing
     */
    constructor(
        protected mallardCache: MallardCache
    ) {
    }

    /**
     * Manipulates request options as wished by the user.
     * @param requestOptions options to be manipulated
     */
    public abstract process(requestOptions: RequestOptions): Promise<RequestOptions | RequestOptions[]>;

    /**
     * Updates {@link RequestOptions.host}.
     * @param preferences host set by the user
     * @param newRequestOptions processed request options
     * @private
     */
    protected processHost(preferences: RequestOptions, newRequestOptions: RequestOptions): RequestOptions {
        if (!!preferences.host)
            newRequestOptions.host = preferences.host;
        return newRequestOptions;
    }

    /**
     * Updates {@link RequestOptions.port}.
     * @param preferences port set by the user
     * @param newRequestOptions processed request options
     * @private
     */
    protected processPort(preferences: RequestOptions, newRequestOptions: RequestOptions): RequestOptions {
        if (!!preferences.port)
            newRequestOptions.port = preferences.port;
        return newRequestOptions;
    }

    /**
     * Updates {@link RequestOptions.path}. E.g. preferences like `/api{0}` will change a path like `/data` to
     * `/api/data`.
     * @param preferences path pattern set by the user
     * @param newRequestOptions processed request options
     * @private
     */
    protected processPath(preferences: RequestOptions, newRequestOptions: RequestOptions): RequestOptions {
        if (!!preferences.path && !!newRequestOptions.path)
            newRequestOptions.path = preferences.path.replace('{0}', newRequestOptions.path);
        return newRequestOptions;
    }

}