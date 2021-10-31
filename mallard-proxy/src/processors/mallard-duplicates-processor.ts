import {MallardProcessorAbstract} from "./mallard-processor.abstract";
import {RequestOptions} from "http";

export class MallardDuplicatesProcessor extends MallardProcessorAbstract {

    public process(requestOptions: RequestOptions): Promise<RequestOptions[]> {
        function isNotNull(value: RequestOptions | null): value is RequestOptions {
            return !!value;
        }

        return this.mallardCache.getDuplicates()
            .then((duplicateIds: string[]) => Promise.all(duplicateIds.map(this.mallardCache.getRequestOptions)))
            .then((preferences: (RequestOptions | null)[]) => {
                return preferences
                    .filter(isNotNull)
                    .map((preference: RequestOptions) => {
                        let newRequestOptions: RequestOptions = {...requestOptions};
                        newRequestOptions = this.processHost(preference, newRequestOptions);
                        newRequestOptions = this.processPort(preference, newRequestOptions);
                        newRequestOptions = this.processPath(preference, newRequestOptions);
                        return newRequestOptions;
                    });
            });
    }

}