import {RequestOptions} from "http";

export interface Server {
    _id: number,
    isActual: boolean,
    options: RequestOptions
}