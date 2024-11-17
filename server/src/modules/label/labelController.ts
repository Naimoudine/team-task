import { Request, Response } from "express";
import { getCollection } from "../../mongoClient";
export interface Label {
  label: string;
}

export const createLabel = async (req: Request, res: Response) => {
  try {
    const { label } = req.body;

    if (!label || typeof label !== "string") {
      res.status(400).json({ message: "label is required and is a string" });
      return;
    }

    const labelCollection = await getCollection<Label>("labels");

    const result = await labelCollection.insertOne({ label: req.body.label });

    if (!result.acknowledged) {
      res.status(422).json({ message: "Failed to create label" });
      return;
    }

    res
      .status(201)
      .json({ message: "Label created", labelId: result.insertedId });
  } catch (error) {
    console.error("Error fetching tasklist:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const readAll = async (req: Request, res: Response) => {
  try {
    const labelCollection = await getCollection<Label>("labels");
    const labelList = await labelCollection.find({}).toArray();
    res.json(labelList);
  } catch (error) {
    console.error("Error fetching tasklist:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
