import { Request, Response } from "express";
import { getCollection } from "../../mongoClient";
import { ObjectId } from "mongodb";

interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
}

export const getUsers = async (req: Request, res: Response) => {
  try {
    const usersCollection = await getCollection<User>("users");
    const users = await usersCollection.find({}).toArray();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
