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
