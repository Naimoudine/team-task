import { ObjectId } from "mongodb";
import { client, getCollection } from "../../mongoClient";
import { Request, Response } from "express";
import { User } from "../users/userController";
import { TaskList } from "../tasks/taskListController";
import { Task } from "../tasks/taskController";

export interface Project {
  _id?: ObjectId;
  title: string;
  taskLists: ObjectId[];
  userId: ObjectId;
}

export const createProject = async (req: Request, res: Response) => {
  try {
    const userCollection = await getCollection<User>("users");
    const userId = new ObjectId(req.params.id);

    if (!ObjectId.isValid(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const userExists = await userCollection.findOne({ _id: userId });

    if (userExists) {
      const projectCollection = await getCollection<Project>("projects");

      const project = {
        title: req.body.title,
        taskLists: req.body.taskLists,
        userId,
      };

      const result = await projectCollection.insertOne(project);

      if (result.acknowledged) {
        const newProjectId = result.insertedId;
        const updateUserCollection = await userCollection.updateOne(
          { _id: userId },
          { $push: { projects: newProjectId } }
        );

        if (updateUserCollection.modifiedCount === 1) {
          res.status(201).json({
            projectId: newProjectId,
            message: "Project created and added to user's project list!",
          });
        } else {
          res.status(500).json({
            message:
              "project created but failed to update user's projects list",
          });
        }
      }
    } else {
      res.status(404).json({ message: "User doesn't exists" });
    }
  } catch (error) {
    console.error("Error fetching tasklist:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const readAll = async (req: Request, res: Response) => {
  try {
    const projectCollection = await getCollection<Project>("projects");
    const projects = await projectCollection
      .aggregate([
        {
          $lookup: {
            from: "taskLists", // La collection des tâches
            localField: "taskLists", // Le champ de la collection d'origine
            foreignField: "_id", // Le champ de la collection de jointure
            as: "taskListsDetails", // Le nom du tableau pour stocker les résultats
          },
        },
      ])
      .toArray();
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching tasklist:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const readById = async (req: Request, res: Response) => {
  try {
    const projectCollection = await getCollection<Project>("projects");
    const project = await projectCollection.findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!project) {
      res.status(404).json({ message: "Project doesn't exists." });
      return;
    }
    res.json(project);
  } catch (error) {
    console.error("Error fetching tasklist:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const readProjectsByUserId = async (req: Request, res: Response) => {
  try {
    const userId = new ObjectId(req.params.id);
    if (!ObjectId.isValid(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const userCollection = await getCollection<Project>("users");

    const userExists = await userCollection.findOne({ _id: userId });

    if (!userExists) {
      res.status(404).json({ message: "User doesn't exists" });
      return;
    }

    const projectCollection = await getCollection<Project>("projects");

    const projectsWithTaskLists = await projectCollection
      .aggregate([
        {
          $match: { userId },
        },
        {
          $lookup: {
            from: "taskLists",
            localField: "taskLists",
            foreignField: "_id",
            as: "taskListsDetails",
          },
        },
      ])
      .toArray();

    res.status(200).json(projectsWithTaskLists);
  } catch (error) {
    console.error("Error fetching tasklist:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  const session = client.startSession();
  try {
    session.startTransaction();

    const projectCollection = await getCollection<Project>("projects");
    const taskListCollection = await getCollection<TaskList>("taskLists");
    const taskCollection = await getCollection<Task>("tasks");
    const projectId = new ObjectId(req.params.id);

    if (!ObjectId.isValid(projectId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const result = await projectCollection.deleteOne(
      { _id: projectId },
      { session }
    );

    if (result.deletedCount !== 1) {
      await session.abortTransaction();
      res.status(404).json({ message: "Project not found" });
      return;
    }

    const taskLists = await taskListCollection.find({ projectId }).toArray();

    const taskListIds = taskLists.map((taskList) => taskList._id);

    await taskListCollection.deleteMany({ projectId }, { session });

    await taskCollection.deleteMany(
      { taskListId: { $in: taskListIds } },
      { session }
    );

    await session.commitTransaction();

    res.status(200).json({
      message: "Project, task lists, and tasks deleted successfully",
      deletedTaskListsCount: taskListIds.length,
      deletedTasksCount: taskLists.length, // Assuming tasks are directly related to taskLists
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
