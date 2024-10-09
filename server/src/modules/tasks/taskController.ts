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
        priority: req.body.priority,
        taskListId,
      };

      if (req.body.description) {
        task.description = req.body.description;
      }

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
        const newTaskId = result.insertedId;

        const updateTaskListCollection = await taskListCollection.updateOne(
          { _id: taskListId },
          { $push: { tasks: newTaskId } }
        );

        if (updateTaskListCollection.modifiedCount === 1) {
          res.status(201).json({
            taskId: newTaskId,
            message: "Task created and added to task list!",
          });
        } else {
          res
            .status(500)
            .json({ message: "Task created but failed to update task list" });
        }
      }
    } else {
      res.status(404).json({ message: "Task list doesn't exist" });
    }
  } catch (error: any) {
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

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const taskCollection = await getCollection<Task>("tasks");
    const taskId = new ObjectId(req.query.id as string);

    const currentTask = await taskCollection.find({ _id: taskId });

    if (!currentTask) {
      res.status(404).json({ message: "Task doesn't exist" });
      return;
    }

    res.status(200).json(currentTask);
  } catch (error: any) {
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
