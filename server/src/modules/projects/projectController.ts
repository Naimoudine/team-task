import { ObjectId } from "mongodb";
import { client, getCollection } from "../../mongoClient";
import { Request, Response } from "express";
import { User } from "../users/userController";
import { TaskList } from "../tasks/taskListController";
import { Task } from "../tasks/taskController";

export interface ProjectMembers {
  userId: ObjectId;
  role: string;
}

export interface Project {
  _id?: ObjectId;
  title: string;
  taskLists: ObjectId[];
  members: ProjectMembers[];
}

interface Member {
  userId: ObjectId;
  role: string;
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
        members: [{ userId, role: "Owner" }],
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
          return;
        } else {
          res.status(500).json({
            message:
              "project created but failed to update user's projects list",
          });
          return;
        }
      }
    } else {
      res.status(404).json({ message: "User not found" });
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
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const userId = new ObjectId(req.params.id);

    const userCollection = await getCollection<Project>("users");

    const userExists = await userCollection.findOne({ _id: userId });

    if (!userExists) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const projectCollection = await getCollection<Project>("projects");

    const projectsWithTaskLists = await projectCollection
      .aggregate([
        {
          $match: {
            members: { $elemMatch: { userId } },
          },
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

export const addMembers = async (req: Request, res: Response) => {
  const session = client.startSession();
  try {
    session.startTransaction();
    const projectCollection = await getCollection<Project>("projects");
    const userCollection = await getCollection<User>("users");
    const projectId = new ObjectId(req.params.id);

    if (!ObjectId.isValid(projectId)) {
      res.status(400).json({ error: "Invalid project ID" });
      return;
    }

    const projectExists = await projectCollection.findOne(
      { _id: projectId },
      { session }
    );

    if (!projectExists) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    const members = req.body.members;

    const proceedMembers = members.map((member: User) => {
      return { userId: new ObjectId(member._id), role: "collaborator" };
    });

    for (const member of proceedMembers) {
      if (!ObjectId.isValid(member.userId)) {
        await session.abortTransaction();
        res.status(400).json({ error: "Invalid user ID" });
        return;
      }

      const userExists = await userCollection.findOne(
        { _id: member.userId },
        { session }
      );

      if (!userExists) {
        await session.abortTransaction();
        res.status(404).json({ message: "User not found" });
        return;
      }

      if (
        userExists.projects.some(
          (project) => project.toString() === projectId.toString()
        ) &&
        projectExists.members.some(
          (m) => m.userId.toString() === userExists._id.toString()
        )
      ) {
        await session.abortTransaction();
        res
          .status(422)
          .json({ message: "User is already a member of the project" });
        return;
      }

      const updateMembers = await projectCollection.updateOne(
        { _id: projectId },
        { $push: { members: member } },
        { session }
      );

      if (updateMembers.modifiedCount !== 1) {
        await session.abortTransaction();
        res.status(500).json({ message: "Failed to add members" });
        return;
      }

      const updateProjects = await userCollection.updateOne(
        { _id: userExists._id },
        { $push: { projects: projectId } },
        { session }
      );

      if (updateProjects.modifiedCount !== 1) {
        await session.abortTransaction();
        res
          .status(500)
          .json({ message: "Failed to update user's projects list" });
        return;
      }
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Members added successfully" });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error fetching tasklist:", error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    // Always end the session
    session.endSession();
  }
};

export const readProjectMembers = async (req: Request, res: Response) => {
  try {
    const projectCollection = await getCollection<Project>("projects");
    const userCollection = await getCollection<User>("users");
    const projectId = new ObjectId(req.params.id);

    if (!ObjectId.isValid(projectId)) {
      res.status(400).json({ error: "Invalid project ID" });
      return;
    }

    const projectExists = await projectCollection.findOne({ _id: projectId });

    if (!projectExists) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    const userIds = projectExists.members.map((member) => member.userId);

    const members = await userCollection
      .aggregate([
        { $match: { _id: { $in: userIds } } },
        { $project: { firstname: 1, lastname: 1, email: 1 } },
      ])
      .toArray();

    res.json(members);
  } catch (error) {
    console.error("Error fetching tasklist:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteMember = async (req: Request, res: Response) => {
  const session = client.startSession();
  try {
    await session.startTransaction();

    const projectCollection = await getCollection<Project>("projects");
    const userCollection = await getCollection<User>("users");
    const projectId = new ObjectId(req.params.id);
    const memberId = new ObjectId(req.params.memberId);

    if (!ObjectId.isValid(projectId)) {
      session.abortTransaction();
      res.status(400).json({ error: "Invalid project ID" });
      return;
    }

    if (!ObjectId.isValid(memberId)) {
      session.abortTransaction();
      res.status(400).json({ error: "Invalid member ID" });
      return;
    }

    const memberExists = await userCollection.findOne(
      { _id: memberId },
      { session }
    );

    if (!memberExists) {
      session.abortTransaction();
      res.status(404).json({ message: "User not found" });
      return;
    }

    const projectExists = await projectCollection.findOne(
      { _id: projectId },
      { session }
    );

    if (!projectExists) {
      session.abortTransaction();
      res.status(404).json({ message: "Project not found" });
      return;
    }

    const proceedMembers = projectExists.members.map((member) => {
      return { userId: member.userId.toString(), role: member.role };
    });

    if (
      !proceedMembers.some(
        (member) => member.userId === memberExists._id.toString()
      )
    ) {
      session.abortTransaction();
      res.status(422).json({ message: "User is not part of this project" });
      return;
    }

    const updateProject = await projectCollection.updateOne(
      { _id: projectExists._id },
      {
        $pull: { members: { userId: memberExists._id, role: "collaborator" } },
      },
      { session }
    );

    if (updateProject.modifiedCount !== 1) {
      session.abortTransaction();
      res
        .status(500)
        .json({ message: "Failed to update project's member list" });
      return;
    }

    const updateMember = await userCollection.updateOne(
      { _id: memberExists._id },
      { $pull: { projects: projectExists._id } },
      { session }
    );

    if (updateMember.modifiedCount !== 1) {
      session.abortTransaction();
      res.status(500).json({ message: "Failted to update user's projects" });
      return;
    }

    await session.commitTransaction();

    res.status(200).json({ message: "Member successfully removed" });
  } catch (error) {
    console.error("Error fetching tasklist:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
