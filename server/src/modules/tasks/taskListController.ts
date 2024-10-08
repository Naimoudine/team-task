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

export const readAll = async (req: Request, res: Response) => {
  try {
    const taskListCollection = await getCollection<TaskList>("taskLists");
    const taskListsWithTasks = await taskListCollection
      .aggregate([
        {
          $lookup: {
            from: "tasks", // La collection des tâches
            localField: "tasks", // Le champ de la collection d'origine
            foreignField: "_id", // Le champ de la collection de jointure
            as: "tasksDetails", // Le nom du tableau pour stocker les résultats
          },
        },
      ])
      .toArray();

    res.status(200).json(taskListsWithTasks);
  } catch (error) {
    console.error("Error fetching tasklist:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
