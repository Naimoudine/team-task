import { Request, Response } from "express";
import { getCollection } from "../../mongoClient";
import { ObjectId } from "mongodb";
import { User } from "../users/userController";

export interface Invitation {
  sender: ObjectId;
  recipient: ObjectId;
  status: "accepted" | "rejected" | "pending";
  createdAt?: Date;
}

export const createInvitation = async (req: Request, res: Response) => {
  try {
    const invitationCollection = await getCollection<Invitation>("invitations");
    const userCollection = await getCollection<User>("users");

    const userId = new ObjectId(req.params.userId);

    if (!ObjectId.isValid(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const userExists = await userCollection.findOne({
      _id: userId,
    });

    const recipientExists = await userCollection.findOne({
      email: req.body.email,
    });

    if (!recipientExists || !userExists) {
      res.status(404).json({ message: "User doesn't exist" });
      return;
    }

    const invitationExists = await invitationCollection.findOne({
      $or: [{ recipient: recipientExists._id }, { sender: userExists._id }],
    });

    if (invitationExists && invitationExists.status !== "rejected") {
      res.status(422).json({ message: "Invitation already exists" });
      return;
    }

    const newInvitation: Invitation = {
      sender: userExists._id,
      recipient: recipientExists._id,
      status: "pending",
      createdAt: new Date(),
    };

    const result = await invitationCollection.insertOne(newInvitation);

    if (!result.acknowledged) {
      res.status(500).json({ message: "Failed to create invitation" });
      return;
    }

    res.status(201).json({ message: "Invitation send successfully" });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const readAll = async (req: Request, res: Response) => {
  try {
    const invitationCollection = await getCollection<Invitation>("invitations");
    const invitations = await invitationCollection.find().toArray();
    res.json(invitations);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const readByUserId = async (req: Request, res: Response) => {
  try {
    const invitationCollection = await getCollection<Invitation>("invitations");
    const id = new ObjectId(req.params.id);

    if (!ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const invitation = await invitationCollection
      .aggregate([
        {
          $match: {
            $or: [{ recipient: id }, { sender: id }],
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "sender",
            foreignField: "_id",
            as: "senderDetails",
            pipeline: [
              {
                $project: {
                  _id: 1, // Inclure l'ID si nécessaire
                  firstname: 1,
                  lastname: 1,
                  email: 1,
                },
              },
            ],
          },
        },
        {
          $addFields: {
            senderDetails: { $arrayElemAt: ["$senderDetails", 0] },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "recipient",
            foreignField: "_id",
            as: "recipientDetails",
            pipeline: [
              {
                $project: {
                  _id: 1, // Inclure l'ID si nécessaire
                  firstname: 1,
                  lastname: 1,
                  email: 1,
                },
              },
            ],
          },
        },
        {
          $addFields: {
            recipientDetails: { $arrayElemAt: ["$recipientDetails", 0] },
          },
        },
      ])
      .toArray();

    if (!invitation) {
      res.status(404).json({ message: "Failed to find inviation" });
      return;
    }

    res.json(invitation);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
