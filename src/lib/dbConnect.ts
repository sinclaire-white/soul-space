import { MongoClient, ServerApiVersion } from "mongodb";
const uri = process.env.MONGODB_URI as string;

async function dbConnect(CollectionName: string) {
  if (!uri) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
  }

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect();
    const database = client.db("soulspaceDB");
    const collection = database.collection(CollectionName);
    return { client, collection };
  } catch (error) {
    client.close();
    throw error;
  }
}

export default dbConnect;

