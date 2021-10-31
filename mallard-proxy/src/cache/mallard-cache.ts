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
     * Sets a field in {@link RequestOptions requestOptions} for a server. Errors are not caught and have to be taken
     * care of by the caller.
     * @param id server to be updated
     * @param key name of field to update in request options
     * @param value new value for field
     * @return number of fields that were __added__
     */
    public readonly setRequestOption = (id: number, key: keyof RequestOptions, value: string): Promise<number> =>
        promisify(this.redisClient.hset).bind(this.redisClient)([`server:${id}`, key, value]);

    /**
     * Gets {@link RequestOptions requestOptions} for a server. Errors are not caught and have to be taken care of by
     * the caller.
     * @param id server to get options from
     * @return options if found otherwise `null`
     */
    public readonly getRequestOptions = (id: string): Promise<RequestOptions | null> =>
        promisify(this.redisClient.hgetall).bind(this.redisClient)(`server:${id}`);

    /**
     * Gets the id of the actual server. Errors are not caught.
     * @return id of actual server or null if not found
     */
    public readonly getActual = (): Promise<string | null> =>
        promisify(this.redisClient.get).bind(this.redisClient)('actual');

    /**
     * Gets the ids of all the duplicate servers.
     * @return array (possibly empty) of ids of all duplicate servers
     */
    public readonly getDuplicates = (): Promise<string[]> =>
        promisify(this.redisClient.lrange).bind(this.redisClient)('duplicates', 0, -1);
}