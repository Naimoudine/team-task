import { connectDb } from "../../mongoClient";

export async function createTaskCollection() {
  const db = await connectDb();

  await db.createCollection("tasks", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["title", "priority", "taskListId"],
        properties: {
          title: {
            bsonType: "string",
            description: "title must be a string and is required",
          },
          description: {
            bsonType: "string",
            description: "description must be a string",
          },
          priority: {
            bsonType: "number",
            description: "priority must be a number",
          },
          date: {
            bsonType: "date",
            description: "date must be a date",
          },
          due: {
            bsonType: "date",
            description: "due must be a date",
          },
          assigned: {
            bsonType: "objectId",
            description: "assigned must be an id",
          },
          taskListId: {
            bsonType: "objectId",
            description: "taskListId must be an objectId and is required",
          },
        },
      },
    },
  });
  console.info('Collection "task" created successfully!');
}
