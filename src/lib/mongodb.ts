import { MongoClient, MongoClientOptions } from "mongodb";

// Extend global type to include our custom property
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri: string = process.env.MONGODB_URI || "";
const options: MongoClientOptions = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

// Development environment: reuse client to avoid multiple connections during hot reload
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Production: create new client for each request
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;