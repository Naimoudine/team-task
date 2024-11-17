import { connectDb } from "../../mongoClient";

export const createLabelCollection = async () => {
  const db = await connectDb();

  await db.createCollection("labels", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["label"],
        properties: {
          label: {
            bsonType: "string",
            description: "label must be a string and is required",
          },
        },
      },
    },
  });
  console.info('Collection "labels" created successfully!');
};
