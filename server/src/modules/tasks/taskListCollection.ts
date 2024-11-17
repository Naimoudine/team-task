import { connectDb } from "../../mongoClient";

export async function createTaskListCollection() {
  const db = await connectDb();

  await db.createCollection("taskLists", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["title", "tasks", "projectId"],
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
          projectId: {
            bsonType: "objectId",
            description:
              "The projectId field should be an objectId referencing to project",
          },
        },
      },
    },
  });
  console.info('Collection "taskLists" created successfully!');
}
