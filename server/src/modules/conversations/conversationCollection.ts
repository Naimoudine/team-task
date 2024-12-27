import { connectDb } from "../../mongoClient";

export const createConversationCollection = async () => {
  const db = await connectDb();

  await db.createCollection("conversations", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["user1", "user2", "messages", "createdAt"],
        properties: {
          user1: {
            bsonType: "objectId",
            description: "must be an objectId referencing an user",
          },
          user2: {
            bsonType: "objectId",
            description: "must be an objectId referencing an user",
          },
          messages: {
            bsonType: "array",
            items: {
              bsonType: "object",
              required: ["sender", "createdAt"],
              properties: {
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
