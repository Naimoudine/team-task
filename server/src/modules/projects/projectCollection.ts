import { connectDb } from "../../mongoClient";

export async function createProjectCollection() {
  const db = await connectDb();

  await db.createCollection("projects", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["title", "taskLists", "userId"],
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
          userId: {
            bsonType: "objectId",
            description:
              "The userId field must be an ObjectIds referencing an user",
          },
        },
      },
    },
  });
  console.info('Collection "projects" created successfully!');
}
