import { ObjectId } from "mongodb";
import { getCollection } from "../../mongoClient";
import { Request, Response } from "express";

export interface Project {
  _id?: ObjectId;
  title: string;
  taskLists: ObjectId[];
}

export const createProject = async (req: Request, res: Response) => {
  try {
    const projectCollection = await getCollection<Project>("projects");
    const project = await projectCollection.insertOne({
      title: req.body.title,
      taskLists: req.body.taskLists,
    });
    if (project.acknowledged) {
      res.status(201).json(project.insertedId);
    }
  } catch (error) {
    console.error("Error fetching tasklist:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
