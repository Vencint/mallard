import {RequestOptions} from "http";
import {MallardCache} from "../cache/mallard-cache";

/**
 * A processor can process request options for a certain server. It manipulates all the fields with the settings made
 * by the user. The mallard proxy uses these processors to change the request options as wished before sending the
 * received request further to the actual or a duplicate.
 */
export class MallardProcessor {

    /**
     * @see MallardProcessor
     * @param id a processor only ever works for a certain server identified by their id
     * @param mallardCache cache from where to get modifications that need to be applied to the request options when
     * processing
     */
    constructor(
        readonly id: number,
        private mallardCache: MallardCache
    ) {
    }

    /**
     * Manipulates request options as wished by the user.
     * @param requestOptions options to be manipulated
     */
    public process(requestOptions: RequestOptions): Promise<RequestOptions> {
        return this.mallardCache.getRequestOptions(this.id)
            .catch(err => {
                console.error(err);
                return null;
            })
            .then((preferences: RequestOptions | null) => {
                if (!preferences) return requestOptions;

                let newRequestOptions = {...requestOptions};
                newRequestOptions = MallardProcessor.processHost(preferences, newRequestOptions);
                newRequestOptions = MallardProcessor.processPort(preferences, newRequestOptions);
                newRequestOptions = MallardProcessor.processPath(preferences, newRequestOptions);
                return newRequestOptions;
            });
    }

    /**
     * Updates {@link RequestOptions.host}.
     * @param preferences host set by the user
     * @param newRequestOptions processed request options
     * @private
     */
    private static processHost(preferences: RequestOptions, newRequestOptions: RequestOptions): RequestOptions {
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
    private static processPort(preferences: RequestOptions, newRequestOptions: RequestOptions): RequestOptions {
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
    private static processPath(preferences: RequestOptions, newRequestOptions: RequestOptions): RequestOptions {
        if (!!preferences.path && !!newRequestOptions.path)
            newRequestOptions.path = preferences.path.replace('{0}', newRequestOptions.path);
        return newRequestOptions;
    }

}