import { ObjectId } from "mongodb";
import { client, getCollection } from "../../mongoClient";
import { Project } from "../projects/projectController";
import { Request, Response } from "express";
import { Task } from "./taskController";

export interface TaskList {
  _id?: ObjectId;
  title: string;
  tasks: ObjectId[];
  projectId: ObjectId;
}

export const createTaskList = async (req: Request, res: Response) => {
  try {
    const projectCollection = await getCollection<Project>("projects");
    const projectId = new ObjectId(req.params.id);

    if (!ObjectId.isValid(projectId)) {
      res.status(400).json({ error: "Invalid project ID" });
      return;
    }

    const projectExists = await projectCollection.findOne({
      _id: projectId,
    });

    if (projectExists) {
      const taskListCollection = await getCollection<TaskList>("taskLists");
      const result = await taskListCollection.insertOne({
        title: req.body.title,
        tasks: req.body.tasks,
        projectId,
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
    const taskLists = await taskListCollection.find({}).toArray();
    res.json(taskLists);
  } catch (error) {
    console.error("Error fetching tasklist:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const readById = async (req: Request, res: Response) => {
  try {
    const taskListCollection = await getCollection<TaskList>("taskLists");
    const taskListId = new ObjectId(req.params.id);

    if (!ObjectId.isValid(taskListId)) {
      res.status(400).json({ error: "Invalid taskList ID" });
      return;
    }

    const taskList = await taskListCollection.findOne({
      _id: taskListId,
    });

    if (!taskList) {
      res.status(404).json({ message: "Task List doesn't exist" });
      return;
    }
    res.status(200).json(taskList);
  } catch (error) {
    console.error("Error fetching tasklist:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const readTaskListsByProjectId = async (req: Request, res: Response) => {
  try {
    const projectId = new ObjectId(req.params.id as string);

    if (!ObjectId.isValid(projectId)) {
      res.status(400).json({ error: "Invalid project ID" });
      return;
    }

    const projectCollection = await getCollection<Project>("projects");

    const projectExists = await projectCollection.findOne({ _id: projectId });

    // if (!projectExists) {
    //   res.status(404).json({ message: "Project doesn't exists" });
    //   return;
    // }

    const taskListCollection = await getCollection<TaskList>("taskLists");

    const taskListsWithTasks = await taskListCollection
      .aggregate([
        {
          $match: { projectId }, // Filtrer par projectId
        },
        {
          $lookup: {
            from: "tasks", // La collection des tâches
            localField: "tasks", // Le tableau d'ObjectId des tâches dans la taskList
            foreignField: "_id", // Le champ _id dans la collection tasks
            as: "tasksDetails", // Le tableau qui contiendra les détails des tâches
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

export const deleteTaskList = async (req: Request, res: Response) => {
  const session = client.startSession();
  try {
    session.startTransaction();
    const taskListCollection = await getCollection<TaskList>("taskLists");
    const taskListId = new ObjectId(req.params.id);
    const taskCollection = await getCollection<Task>("tasks");

    if (!ObjectId.isValid(taskListId)) {
      res.status(400).json({ error: "Invalid tasklist ID" });
      return;
    }

    const result = await taskListCollection.deleteOne(
      { _id: taskListId },
      { session }
    );

    if (result.deletedCount !== 1) {
      await session.abortTransaction();
      res.status(404).json({ message: "TaskList not found" });
      return;
    }

    const tasks = await taskCollection.find({ taskListId }).toArray();

    await taskCollection.deleteMany({ taskListId }, { session });

    await session.commitTransaction();

    res.status(200).json({
      message: "Project, task lists, and tasks deleted successfully",
      deletedTasksCount: tasks.length,
    });
  } catch (error) {
    // Rollback the transaction on any error
    await session.abortTransaction();
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    // Always end the session
    session.endSession();
  }
};
