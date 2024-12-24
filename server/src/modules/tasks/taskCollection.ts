import { connectDb } from "../../mongoClient";

export async function createTaskCollection() {
  const db = await connectDb();

  await db.createCollection("tasks", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "title",
          "priority",
          "projectId",
          "taskListId",
          "labelList",
          "userId",
        ],
        properties: {
          projectId: {
            bsonType: "objectId",
            description: "must be an objectId referring to the project id",
          },
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
            bsonType: ["date", "null"],
            description: "date must be a date",
          },
          due: {
            bsonType: ["date", "null"],
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
          labelList: {
            bsonType: "array",
            description: "label list must be an array",
          },
          userId: {
            bsonType: "objectId",
            description:
              "The field userId must be an objectId referencing the user",
          },
          assignedTo: {
            bsonType: "array",
            items: {
              bsonType: "objectId",
            },
            description:
              "The field assignedTo must be an array of objectId referencing the users",
          },
        },
      },
    },
  });
  console.info('Collection "task" created successfully!');
}
