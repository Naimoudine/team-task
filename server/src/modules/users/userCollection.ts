import { connectDb } from "../../mongoClient";

export async function createUserCollection() {
  const db = await connectDb();
  await db.createCollection("users", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        require: ["firstname", "lastname", "email", "password"],
        properties: {
          firstname: {
            bsonType: "string",
            descritpion: "'firstname' must be a string and is required",
          },
          lastname: {
            bsonType: "string",
            descritpion: "'lastname' must be a string and is required",
          },
          email: {
            bsonType: "string",
            pattern: "^.+@.+$",
            description: "L'email doit être une chaîne valide",
          },
          password: {
            bsonType: "string",
            descritpion: "'password' must be a string and is required",
          },
        },
      },
    },
  });
}
