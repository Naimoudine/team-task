import { connectDb } from "../../mongoClient";

export async function createProjectCollection() {
  const db = await connectDb();

  await db.createCollection("projects", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["title", "taskLists"],
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
        },
      },
    },
  });
  console.info('Collection "projects" created successfully!');
}
