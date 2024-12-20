import { connectDb } from "../../mongoClient";

export const createInvitationCollection = async () => {
  const db = await connectDb();

  await db.createCollection("invitations", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["sender", "recipient"],
        properties: {
          sender: {
            bsonType: "objectId",
          },
          recipient: {
            bsonType: "objectId",
          },
          status: {
            bsonType: "string",
            enum: ["accepted", "pending", "rejected"],
          },
          createdAt: {
            bsonType: "date",
          },
          updatedAt: {
            bsonType: "date",
          },
        },
      },
    },
  });
  console.info('Collection "invitations" created successfully!');
};
