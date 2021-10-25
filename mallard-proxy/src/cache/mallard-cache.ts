import {createClient, RedisClient} from "redis";
import {RequestOptions} from "http";
import {promisify} from "util";

const REDIS_PORT = parseInt(process.env.MALLARD_REDIS_PORT || '6379');

/**
 * In order to not always retrieve request options for a certain server from the database every time needed processors
 * use a cache to get the information they need faster.
 */
export class MallardCache {

    private readonly redisClient: RedisClient;

    /**
     * @see MallardCache
     */
    constructor() {
        this.redisClient = createClient(
            {
                port: REDIS_PORT
            }
        );
    }

    /**
     * Sets {@link RequestOptions requestOptions} for a server. Errors are not caught and have to be taken care of by
     * the caller.
     * @param id server to be updated
     * @param newRequestOptions new options to be set for server
     * @return promise that resolves when updated
     */
    public readonly setRequestOptions = (id: number, newRequestOptions: RequestOptions): Promise<unknown> =>
        promisify(this.redisClient.set).bind(this.redisClient)(`server-${id}`, JSON.stringify(newRequestOptions));

    /**
     * Gets {@link RequestOptions requestOptions} for a server. Errors are not caught and have to be taken care of by
     * the caller.
     * @param id server to get options from
     * @return promise that resolves with options if found otherwise `null`
     */
    public readonly getRequestOptions = (id: number): Promise<RequestOptions | null> =>
        promisify(this.redisClient.get).bind(this.redisClient)(`server-${id}`)
            .then(MallardCache.stringToRequestOptions);

    /**
     * Helper function to convert a JSON string to {@link RequestOptions}.
     * @param val string value to be converted
     * @return request options if successful otherwise `null`
     * @private
     */
    private static stringToRequestOptions(val: string | null): RequestOptions | null {
        return !!val ?
            JSON.parse(val) as RequestOptions :
            null;
    }

}