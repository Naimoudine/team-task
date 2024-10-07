import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getCollection } from "../../mongoClient";

export interface TaskList {
  _id?: ObjectId;
  title: string;
  tasks: ObjectId[];
}

export const createTaskList = async (req: Request, res: Response) => {
  try {
    const taskListCollection = await getCollection<TaskList>("taskLists");
    const taskList = await taskListCollection.insertOne({
      title: req.body.name,
      tasks: req.body.tasksIds,
    });
    if (taskList.acknowledged) {
      res.status(201).json(taskList.insertedId);
    }
  } catch (error) {
    console.error("Error fetching tasklist:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
