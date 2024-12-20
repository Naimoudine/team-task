import { Request, Response } from "express";
import { getCollection } from "../../mongoClient";
import { ObjectId } from "mongodb";
import { User } from "../users/userController";

export interface Invitation {
  sender: ObjectId;
  recipient: ObjectId;
  status: "accepted" | "rejected" | "pending";
  createdAt?: Date;
  updatedAt?: Date;
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
      $and: [{ email: req.body.email }, { _id: { $ne: userExists?._id } }],
    });

    if (!recipientExists || !userExists) {
      res.status(404).json({ message: "User not found. Try again!" });
      return;
    }

    if (
      recipientExists.friends
        .map((id) => id.toString())
        .includes(userExists._id.toString()) ||
      userExists.friends
        .map((id) => id.toString())
        .includes(recipientExists._id.toString())
    ) {
      res.status(422).json({ message: "User is already in your friend list" });
      return;
    }

    const invitationExists = await invitationCollection.findOne({
      $or: [{ recipient: recipientExists._id }, { sender: userExists._id }],
    });

    if (invitationExists) {
      const updateInvitation = await invitationCollection.updateOne(
        { _id: invitationExists._id },
        { $set: { status: "pending", updatedAt: new Date() } }
      );

      if (updateInvitation.modifiedCount !== 1) {
        res.status(422).json({ message: "Failed to update the invitation" });
        return;
      }
    } else {
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

export const updateInvitation = async (req: Request, res: Response) => {
  try {
    const invitationCollection = await getCollection<Invitation>("invitations");
    const userCollection = await getCollection<User>("users");
    const invitationId = new ObjectId(req.params.id);

    if (!ObjectId.isValid(invitationId)) {
      res.status(400).json({ error: "Invalid invitation ID" });
      return;
    }

    const invitationExists = await invitationCollection.findOne({
      _id: invitationId,
    });

    if (!invitationExists) {
      res.status(404).json({ message: "Invitation doesn't exists" });
      return;
    }

    if (invitationExists.status !== "pending") {
      res.status(400).json({ message: "Invitation already answered" });
      return;
    }

    const result = await invitationCollection.updateOne(
      { _id: invitationId },
      { $set: { status: req.body.status } }
    );

    if (result.modifiedCount !== 1) {
      res.sendStatus(422);
      return;
    }

    const updatedInvitation = await invitationCollection.findOne({
      _id: invitationId,
    });

    if (updatedInvitation?.status === "accepted") {
      const sender = await userCollection.findOne({
        _id: invitationExists.sender,
      });
      const recipient = await userCollection.findOne({
        _id: invitationExists.recipient,
      });

      if (sender && recipient) {
        const senderUpdate = await userCollection.updateOne(
          { _id: sender._id },
          { $addToSet: { friends: recipient?._id } }
        );

        if (senderUpdate.modifiedCount === 0) {
          console.error("Failed to update sender friend list");
        }

        const recipientUpdate = await userCollection.updateOne(
          { _id: recipient._id },
          { $addToSet: { friends: sender?._id } }
        );

        if (recipientUpdate.modifiedCount === 0) {
          console.error("Failed to update recipient friend list");
        }
        res.status(200).json({
          message: `${sender.firstname} ${sender.lastname} added to your friend list`,
        });
        return;
      } else {
        res.status(404).json({ message: "Sender or Recipient not found" });
        return;
      }
    }
    res.status(200).json({
      message: `Invitation rejected`,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const cancelInvitation = async (req: Request, res: Response) => {
  try {
    const invitationCollection = await getCollection<Invitation>("invitations");
    const invitationId = new ObjectId(req.params.id);

    if (!ObjectId.isValid(invitationId)) {
      res.status(400).json({ error: "Invalid invitation ID" });
      return;
    }

    const invitationExists = await invitationCollection.findOne({
      _id: invitationId,
      status: "pending",
    });

    if (!invitationExists) {
      res
        .status(400)
        .json({ message: "Only pending inviation can be cancelled" });
      return;
    }

    const result = await invitationCollection.deleteOne({
      _id: invitationExists._id,
    });

    if (result.deletedCount !== 1) {
      res
        .status(404)
        .json({ message: "Invitation doesn't exist or is already cancelled" });
      return;
    }
    res.status(200).json({ message: "Invitation cancelled" });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
