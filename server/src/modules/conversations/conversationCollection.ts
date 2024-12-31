import { connectDb } from "../../mongoClient";

export const createConversationCollection = async () => {
  const db = await connectDb();

  await db.createCollection("conversations", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["creator", "correspondent", "messages", "createdAt"],
        properties: {
          creator: {
            bsonType: "objectId",
          },
          correspondent: {
            bsonType: "objectId",
          },
          messages: {
            bsonType: "array",
            items: {
              bsonType: "object",
              required: ["_id", "sender", "createdAt"],
              properties: {
                _id: {
                  bsonType: "objectId",
                  description: "Unique identifier for each message",
                },
                sender: {
                  bsonType: "objectId",
                  description:
                    "must be an objectId referencing to one of the users",
                },
                text: {
                  bsonType: ["string", "null"],
                },
                image: {
                  bsonType: ["string", "null"],
                },
                createdAt: {
                  bsonType: "date",
                },
              },
            },
          },
          createdAt: {
            bsonType: "date",
            description: "must be a date",
          },
        },
      },
    },
  });
  console.info('Collection "conversation" created successfully!');
};
