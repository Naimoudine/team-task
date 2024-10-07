import { ObjectId } from "mongodb";
import { Request, Response } from "express";
import { getCollection } from "../../mongoClient";
import { TaskList } from "./taskListController";

interface Task {
  _id?: ObjectId;
  title: string;
  description?: string;
  priority: number;
  date?: Date;
  due?: Date;
  assigned?: ObjectId;
  taskListId: ObjectId;
}

export const createTask = async (req: Request, res: Response) => {
  try {
    const taskListCollection = await getCollection<TaskList>("taskLists");
    const taskListId = new ObjectId(req.params.id as string);

    const taskListExists = await taskListCollection.findOne({
      _id: taskListId,
    });

    if (taskListExists) {
      const taskCollection = await getCollection<Task>("tasks");

      const task: Task = {
        title: req.body.title,
        description: req.body.description || undefined, // Peut être défini comme undefined
        priority: req.body.priority,
        taskListId,
      };

      if (req.body.date) {
        task.date = new Date(req.body.date);
      }
      if (req.body.due) {
        task.due = new Date(req.body.due);
      }
      if (req.body.assigned) {
        task.assigned = new ObjectId(req.body.assigned as string);
      }

      console.log("Document à insérer:", JSON.stringify(task, null, 2)); // Log pour débogage

      const result = await taskCollection.insertOne(task);
      if (result.acknowledged) {
        res.status(201).json(result.insertedId);
      }
    } else {
      res.status(404).json({ message: "Task list doesn't exist" });
    }
  } catch (error) {
    console.error("Error while creating task:", error);
    if (error.errInfo) {
      console.error(
        "Erreur de validation:",
        JSON.stringify(error.errInfo, null, 2)
      );
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};
