import { Collection, Db, MongoClient } from "mongodb";
import { MONGODB_CONNECTION_STRING, NODE_ENV } from "$env/static/private";

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;
let databases: { [key: string]: Db } = {};

function getDatabases(client: MongoClient) {
    databases["core"] = client.db("core");
    databases["app"] = client.db("app");
}

if (NODE_ENV === "development") {
    if (!(global as any)._mongoClientPromise) {
        client = new MongoClient(MONGODB_CONNECTION_STRING, options);
        (global as any)._mongoClientPromise = client.connect();
        getDatabases(client);
    }

    clientPromise = (global as any)._mongoClientPromise;
} else {
    client = new MongoClient(MONGODB_CONNECTION_STRING, options);
    clientPromise = client.connect();
    getDatabases(client);
}

export default clientPromise;

export function getCollection(databaseName: string, collectionName: string): Collection {
    return databases[databaseName].collection(collectionName);
}
