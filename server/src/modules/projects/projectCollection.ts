import { connectDb } from "../../mongoClient";

export async function createProjectCollection() {
  const db = await connectDb();

  await db.createCollection("projects", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["title", "taskLists", "members"],
        properties: {
          title: {
            bsonType: "string",
            description: "title must be a string and is required",
          },
          taskLists: {
            bsonType: "array",
            items: {
              bsonType: "objectId",
            },
            description:
              "The tasksLists field must be an array of ObjectIds referencing tasks",
          },
          members: {
            bsonType: "array",
            items: {
              bsonType: "object",
              required: ["userId", "role"],
              properties: {
                userId: {
                  bsonType: "objectId",
                  description:
                    "The userId field must be an ObjectIds referencing an user",
                },
                role: {
                  bsonType: "string",
                  enum: ["Owner", "collaborator"],
                  description:
                    "The role field must be a string representing the user rôle in this project",
                },
              },
            },
            description: "Array of members with their roles",
          },
        },
      },
    },
  });
  console.info('Collection "projects" created successfully!');
}
