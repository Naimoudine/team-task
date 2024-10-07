import { connectDb } from "../../mongoClient";

export async function createTaskListCollection() {
  const db = await connectDb();

  await db.createCollection("taskLists", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["title", "tasks"],
        properties: {
          title: {
            bsonType: "string",
            description:
              "The task list title is required and must be a string'",
          },
          tasks: {
            bsonType: "array",
            items: {
              bsonType: "objectId",
            },
            description:
              "The tasks field must be an array of ObjectIds referencing tasks",
          },
        },
      },
    },
  });
  console.info('Collection "taskLists" created successfully!');
}
