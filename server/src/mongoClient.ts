import { MongoClient, Document, Collection, Db } from "mongodb";
import dotenv from "dotenv";
import { createUserCollection } from "./modules/users/userCollection";
import { createTaskListCollection } from "./modules/tasks/taskListCollection";
import { createTaskCollection } from "./modules/tasks/taskCollection";
import { createProjectCollection } from "./modules/projects/projectCollection";
import { createLabelCollection } from "./modules/label/labelCollection";

dotenv.config();

const uri = process.env.DB_URI as string;
const client = new MongoClient(uri);

let dbInstance: Db | null = null; // Stocker l'instance de la base de données

export async function connectDb() {
  try {
    // Si la connexion a déjà été établie, retourner l'instance existante
    if (dbInstance) {
      return dbInstance;
    }

    // Si aucune connexion n'existe, se connecter et stocker l'instance
    await client.connect();
    console.info("Connected to mongoDB");
    dbInstance = client.db("task-team");
    return dbInstance;
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

export async function createAllCollection() {
  try {
    await createProjectCollection();
    await createTaskListCollection();
    await createTaskCollection();
    await createLabelCollection();
  } catch (error) {
    console.error("Error while creating collections: ", error);
  }
}

createAllCollection();
