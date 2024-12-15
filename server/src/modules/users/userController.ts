import { Request, Response } from "express";
import { getCollection } from "../../mongoClient";
import { ObjectId } from "mongodb";
import { MongoServerError } from "mongodb";

export interface User {
  _id?: ObjectId;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  projects: ObjectId[];
  friends: ObjectId[];
}

export const readAll = async (req: Request, res: Response) => {
  try {
    const userCollection = await getCollection<User>("users");
    const users = await userCollection.find({}).toArray();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const userCollection = await getCollection<User>("users");
    if (
      !req.body.firstname ||
      !req.body.lastname ||
      !req.body.email ||
      !req.body.hashedPassword
    ) {
      res.sendStatus(422);
      return;
    }

    const user = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.hashedPassword,
      projects: [],
      friends: [],
    };

    const result = await userCollection.insertOne(user);

    if (!result.insertedId) {
      res.status(409).json({ message: "Failed to create user" });
      return;
    }

    if (result.acknowledged) {
      res.status(201).json(result.insertedId);
    }
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      res.status(409).json({
        message: "User with this email already exists. Please log in.",
      });
    } else {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export const readById = async (req: Request, res: Response) => {
  try {
    const userCollection = await getCollection<User>("users");
    const userId = new ObjectId(req.params.id);

    if (!ObjectId.isValid(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const user = await userCollection.findOne({
      _id: userId,
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
