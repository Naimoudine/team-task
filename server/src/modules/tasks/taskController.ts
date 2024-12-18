import { ObjectId } from "mongodb";
import { NextFunction, Request, Response } from "express";
import { getCollection } from "../../mongoClient";
import type { TaskList } from "./taskListController";

export interface Task {
  _id?: ObjectId;
  title: string;
  description?: string;
  priority: number;
  date?: Date | null;
  due?: Date | null;
  assigned?: ObjectId;
  taskListId: ObjectId;
  labelList: string[];
  userId: ObjectId;
}

export const createTask = async (req: Request, res: Response) => {
  try {
    const taskListCollection = await getCollection<TaskList>("taskLists");
    const taskListId = new ObjectId(req.params.id);
    const userId = new ObjectId(req.params.userId);

    if (!ObjectId.isValid(taskListId)) {
      res.status(400).json({ error: "Invalid taskList ID" });
      return;
    }

    if (!ObjectId.isValid(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const taskListExists = await taskListCollection.findOne({
      _id: taskListId,
    });

    if (taskListExists) {
      const taskCollection = await getCollection<Task>("tasks");

      const task: Task = {
        title: req.body.title,
        priority: req.body.priority,
        taskListId,
        labelList: [],
        userId,
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

export const readAll = async (req: Request, res: Response) => {
  try {
    const userId = new ObjectId(req.params.id);
    if (!ObjectId.isValid(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }
    const taskCollection = await getCollection<Task>("tasks");
    const tasks = await taskCollection.find({ userId: userId }).toArray();
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasklist:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const readTaskByTaskListId = async (req: Request, res: Response) => {
  const taskCollection = await getCollection<Task>("tasks");
  const taskListId = new ObjectId(req.params.id as string);

  if (!ObjectId.isValid(taskListId)) {
    res.status(400).json({ error: "Invalid taskList ID" });
    return;
  }

  const tasks = await taskCollection.find({ taskListId: taskListId }).toArray();
  if (tasks.length === 0) {
    res.status(404).json({ message: "No tasks in this list" });
    return;
  }
  res.json(tasks);
};

export const readTaskById = async (req: Request, res: Response) => {
  try {
    const taskCollection = await getCollection<Task>("tasks");

    const taskId = new ObjectId(req.params.id as string);

    if (!ObjectId.isValid(taskId)) {
      res.status(400).json({ error: "Invalid task ID" });
      return;
    }

    const currentTask = await taskCollection.findOne({ _id: taskId });

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

export const updateTaskPriority = async (req: Request, res: Response) => {
  try {
    const taskCollection = await getCollection<Task>("tasks");

    const taskId = new ObjectId(req.params.id);

    if (!ObjectId.isValid(taskId)) {
      res.status(400).json({ error: "Invalid task ID" });
      return;
    }

    const result = await taskCollection.updateOne(
      { _id: taskId },
      { $set: { priority: req.body.priority } }
    );

    if (result.modifiedCount !== 1) {
      res.sendStatus(422);
      return;
    }

    res.sendStatus(204);
  } catch (error) {
    console.error("Error fetching tasklist:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateTaskLabelList = async (req: Request, res: Response) => {
  try {
    const taskCollection = await getCollection<Task>("tasks");
    const taskId = req.params.id;

    if (!taskId || !ObjectId.isValid(taskId)) {
      res.status(400).json({ message: "task id is missing or is invalid" });
      return;
    }

    const labelExists = await taskCollection.findOne({
      _id: new ObjectId(taskId),
      labelList: req.body.label,
    });

    let result = null;

    if (!labelExists) {
      result = await taskCollection.updateOne(
        { _id: new ObjectId(taskId) },
        { $push: { labelList: req.body.label } }
      );
    }

    if (labelExists) {
      result = await taskCollection.updateOne(
        { _id: new ObjectId(taskId) },
        { $pull: { labelList: req.body.label } }
      );
    }

    if (result && result.modifiedCount !== 1) {
      res.status(422).json({ message: "Failed to update label list" });
      return;
    }

    if (result && result.acknowledged) {
      res.sendStatus(204);
    }
  } catch (error) {
    console.error("Error fetching tasklist:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateTaskTaskList = async (req: Request, res: Response) => {
  try {
    const taskCollection = await getCollection<Task>("tasks");
    const taskListCollection = await getCollection<TaskList>("taskLists");
    const taskId = req.params.id;
    const newTaskListId = req.params.taskListId;

    if (!taskId || !ObjectId.isValid(taskId)) {
      res.status(400).json({ message: "task id is missing or is invalid" });
      return;
    }

    const currentTask = await taskCollection.findOne({
      _id: new ObjectId(taskId),
    });

    const newTaskListExists = await taskListCollection.findOne({
      _id: new ObjectId(newTaskListId),
    });

    if (!newTaskListExists || !currentTask) {
      res.status(404).json({ message: " task or taskList don't exists" });
      return;
    }

    const updateTask = await taskCollection.updateOne(
      { _id: new ObjectId(taskId) },
      { $set: { taskListId: new ObjectId(newTaskListId) } }
    );

    const updateOldList = await taskListCollection.updateOne(
      { _id: currentTask?.taskListId },
      { $pull: { tasks: currentTask?._id } }
    );

    const updateNewList = await taskListCollection.updateOne(
      { _id: new ObjectId(newTaskListId) },
      { $push: { tasks: currentTask?._id } }
    );

    if (
      updateTask.modifiedCount !== 1 ||
      updateOldList.modifiedCount !== 1 ||
      updateNewList.modifiedCount !== 1
    ) {
      res.status(422).json({ message: "Failed to update task and taskLists" });
      return;
    }
    res.sendStatus(204);
  } catch (error) {
    console.error("Error fetching tasklist:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateTaskDescription = async (req: Request, res: Response) => {
  try {
    const taskCollection = await getCollection<Task>("tasks");
    const taskId = new ObjectId(req.params.id);

    if (!taskId || !ObjectId.isValid(taskId)) {
      res.status(400).json({ message: "task id is missing or is invalid" });
      return;
    }

    const result = await taskCollection.updateOne(
      { _id: taskId },
      { $set: { description: req.body.description } }
    );

    if (!result.acknowledged) {
      res.status(422).json({ message: "Failed to update task description" });
      return;
    }

    res.sendStatus(204);
  } catch (error) {
    console.error("Error fetching tasklist:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateTaskDate = async (req: Request, res: Response) => {
  try {
    const taskCollection = await getCollection<Task>("tasks");
    const taskId = new ObjectId(req.params.id);

    if (!taskId || !ObjectId.isValid(taskId)) {
      res.status(400).json({ message: "task id is missing or is invalid" });
      return;
    }

    const result = await taskCollection.updateOne(
      { _id: taskId },
      { $set: { date: req.body.date ? new Date(req.body.date) : null } }
    );

    if (!result.acknowledged) {
      res.status(422).json({ message: "Failed to update task date" });
      return;
    }

    res.sendStatus(204);
  } catch (error) {
    console.error("Error fetching tasklist:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateTaskDue = async (req: Request, res: Response) => {
  try {
    const taskCollection = await getCollection<Task>("tasks");
    const taskId = new ObjectId(req.params.id);

    if (!taskId || !ObjectId.isValid(taskId)) {
      res.status(400).json({ message: "task id is missing or is invalid" });
      return;
    }

    const result = await taskCollection.updateOne(
      { _id: taskId },
      { $set: { due: req.body.due ? new Date(req.body.due) : null } }
    );

    if (!result.acknowledged) {
      res.status(422).json({ message: "Failed to update task due date" });
      return;
    }

    res.sendStatus(204);
  } catch (error) {
    console.error("Error fetching tasklist:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskCollection = await getCollection<Task>("tasks");
    const taskId = new ObjectId(req.params.id);

    if (!taskId || !ObjectId.isValid(taskId)) {
      res.status(400).json({ message: "task id is missing or is invalid" });
      return;
    }

    const result = await taskCollection.deleteOne({ _id: taskId });

    if (result.deletedCount !== 1) {
      res.status(422).json({ message: "Failed to delete task" });
      return;
    }

    res.sendStatus(204);
  } catch (error) {
    console.error("Error fetching tasklist:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
