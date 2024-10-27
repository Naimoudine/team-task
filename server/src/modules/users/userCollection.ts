import { connectDb } from "../../mongoClient";

export async function createUserCollection() {
  const db = await connectDb();
  const userCollection = await db.createCollection("users", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["firstname", "lastname", "email", "password"],
        properties: {
          firstname: {
            bsonType: "string",
            description: "'firstname' must be a string and is required",
          },
          lastname: {
            bsonType: "string",
            description: "'lastname' must be a string and is required",
          },
          email: {
            bsonType: "string",
            pattern: "^.+@.+$",
            description: "L'email doit être une chaîne valide",
          },
          password: {
            bsonType: "string",
            description: "'password' must be a string and is required",
          },
        },
      },
    },
  });
  await userCollection.createIndex({ email: 1 }, { unique: true });
  console.log("Unique index on email created (if not existing).");
  console.info('Collection "users" created successfully!');
}
