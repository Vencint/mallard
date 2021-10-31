import {RequestOptions} from "http";
import {MallardProcessorAbstract} from "./mallard-processor.abstract";

// TODO: MallardProcessorAbstract will fetch actual and duplicates from the cache itself
//  the process function will then return an array of request options for duplicates

/**
 * A processor can process request options for a certain server. It manipulates all the fields with the settings made
 * by the user. The mallard proxy uses these processors to change the request options as wished before sending the
 * received request further to the actual or a duplicate.
 */
export class MallardActualProcessor extends MallardProcessorAbstract {

    public process(requestOptions: RequestOptions): Promise<RequestOptions> {
        return this.mallardCache.getActual()
            .then((actualId: string | null) => {
                if (!actualId) throw new Error('No actual id found.')
                else return this.mallardCache.getRequestOptions(actualId);
            })
            .then((preferences: RequestOptions | null) => {
                if (!preferences) throw new Error('No actual preferences found.');

                let newRequestOptions: RequestOptions = {...requestOptions};
                newRequestOptions = this.processHost(preferences, newRequestOptions);
                newRequestOptions = this.processPort(preferences, newRequestOptions);
                newRequestOptions = this.processPath(preferences, newRequestOptions);
                return newRequestOptions;
            });
    }

}