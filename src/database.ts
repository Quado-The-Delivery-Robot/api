import { Collection, Db, MongoClient } from "mongodb";

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;
let databases: { [key: string]: Db } = {};

function getDatabases(client: MongoClient) {
    databases["core"] = client.db("core");
    databases["app"] = client.db("app");
}

if (process.env.NODE_ENV === "development") {
    if (!(global as any)._mongoClientPromise) {
        client = new MongoClient(process.env.MONGODB_CONNECTION_STRING, options);
        (global as any)._mongoClientPromise = client.connect();
        getDatabases(client);
    }

    clientPromise = (global as any)._mongoClientPromise;
} else {
    client = new MongoClient(process.env.MONGODB_CONNECTION_STRING, options);
    clientPromise = client.connect();
    getDatabases(client);
}

export default clientPromise;

export function getCollection(databaseName: string, collectionName: string): Collection {
    return databases[databaseName].collection(collectionName);
}