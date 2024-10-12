import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getCollection } from "../../mongoClient";
import { Project } from "../projects/projectController";

export interface TaskList {
  _id?: ObjectId;
  title: string;
  tasks: ObjectId[];
}

export const createTaskList = async (req: Request, res: Response) => {
  try {
    const projectCollection = await getCollection<Project>("projects");
    const projectId = new ObjectId(req.params.id as string);

    const projectExists = await projectCollection.findOne({
      _id: projectId,
    });

    if (projectExists) {
      const taskListCollection = await getCollection<TaskList>("taskLists");
      const result = await taskListCollection.insertOne({
        title: req.body.title,
        tasks: req.body.tasks,
      });

      if (result.acknowledged) {
        const newTaskListId = result.insertedId;
        const updateProjectCollection = await projectCollection.updateOne(
          { _id: projectId },
          { $push: { taskLists: newTaskListId } }
        );

        if (updateProjectCollection.modifiedCount === 1) {
          res.status(201).json({
            taskListId: newTaskListId,
            message: "TaskList created and added to project!",
          });
        } else {
          res
            .status(500)
            .json({ message: "Task created but failed to update project" });
        }
      }
    } else {
      res.status(404).json({ message: "Project doesn't exist" });
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
