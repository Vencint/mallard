import {RequestOptions} from "http";
import {MallardEventPayloadInterface} from "./mallard-event-payload.interface";

/**
 * Defining properties needed to update `path` in request options.
 */
export interface MallardPathInterface extends MallardEventPayloadInterface {
    path: RequestOptions['path']
}