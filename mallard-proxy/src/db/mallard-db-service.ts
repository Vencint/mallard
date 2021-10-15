import {MongoClient} from "mongodb";
import {MallardDb} from "./mallard-db";
import {Server} from "../models/Server";


export class MallardDbService {
    private static instance: MallardDbService = new MallardDbService();
    private url: string;

    public static getInstance(): MallardDbService {
        return this.instance;
    }

    private constructor() {
        this.url = process.env.DB_URL || 'mongodb://localhost:27017/';
    }

    public findAllClientOptions = (): Promise<Server[]> => {
        return MongoClient
            .connect(this.url)
            .then(client => client
                .db(MallardDb.db)
                .collection(MallardDb.clientOptions)
                .find()
                .toArray()
                .finally(() => client.close())
            ) as Promise<Server[]>;
    }
}