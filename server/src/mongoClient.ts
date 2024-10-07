import { MongoClient, Document } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.DB_URI as string;
const client = new MongoClient(uri);

export async function connectDb() {
  try {
    await client.connect();
    console.info("Connected to mongoDB");
    return client.db("sample_mflix");
  } catch (error) {
    console.error("Error while connecting to db", error);
    throw error;
  }
}

export async function getCollection<T extends Document>(
  collectionName: string
) {
  const db = await connectDb();
  return db.collection<T>(collectionName);
}
