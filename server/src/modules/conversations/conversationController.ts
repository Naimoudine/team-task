import { Request, Response } from "express";
import { getCollection } from "../../mongoClient";
import { ObjectId } from "mongodb";
import { User } from "../users/userController";
import { connectedUsers, io } from "../..";
import { validateConversationAccess } from "../../lib/utils";

export interface Message {
  _id: ObjectId;
  text?: string;
  sender: ObjectId;
  image?: string;
  createdAt: Date;
}
export interface Conversation {
  _id?: ObjectId;
  creator: ObjectId;
  correspondent: ObjectId;
  messages: Message[];
  createdAt: Date;
}

export const createConversation = async (req: Request, res: Response) => {
  try {
    const conversationCollection = await getCollection<Conversation>(
      "conversations"
    );
    const userCollection = await getCollection<User>("users");

    if (
      !ObjectId.isValid(req.params.id) ||
      !ObjectId.isValid(req.params.friendId)
    ) {
      res.status(400).json({ message: "Invalid user or friend ID" });
      return;
    }

    const userId = new ObjectId(req.params.id);
    const friendId = new ObjectId(req.params.friendId);

    if (userId.equals(friendId)) {
      res
        .status(400)
        .json({ message: "Cannot create a conversation with yourself" });
      return;
    }

    const userExists = await userCollection.findOne({ _id: userId });

    if (!userExists) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const friendExists = await userCollection.findOne({
      _id: friendId,
    });

    if (!friendExists) {
      res.status(404).json({ message: "Friend not found" });
      return;
    }

    const conversationExists = await conversationCollection.findOne({
      creator: userExists._id,
      correspondent: friendExists._id,
    });

    if (conversationExists) {
      res.status(409).json({ message: "Conversation already exists" });
      return;
    }

    const newConversation: Conversation = {
      creator: userExists._id,
      correspondent: friendExists._id,
      messages: [],
      createdAt: new Date(),
    };

    const result = await conversationCollection.insertOne(newConversation);

    if (!result.insertedId) {
      res.status(500).json({ message: "Failed to create conversation" });
      return;
    }

    res.status(201).json({
      message: "Conversation created successfully",
      conversationId: result.insertedId,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const readConversationById = async (req: Request, res: Response) => {
  try {
    const conversationCollection = await getCollection<Conversation>(
      "conversations"
    );
    const conversationId = new ObjectId(req.params.id);

    if (!ObjectId.isValid(conversationId)) {
      res.status(400).json({ message: "Invalid conversation ID" });
      return;
    }

    const conversationExists = await conversationCollection.findOne({
      _id: conversationId,
    });

    if (!conversationExists) {
      res.status(404).json({ message: "Conversation not found" });
      return;
    }

    res.json(conversationExists);
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const readConversationByUserId = async (req: Request, res: Response) => {
  try {
    const conversationCollection = await getCollection<Conversation>(
      "conversations"
    );
    const userCollection = await getCollection<User>("users");
    const userId = new ObjectId(req.params.id);

    if (!ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    const userExists = await userCollection.findOne({ _id: userId });

    if (!userExists) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const conversationExists = await conversationCollection
      .aggregate([
        { $match: { $or: [{ creator: userId }, { correspondent: userId }] } },
        {
          $lookup: {
            from: "users",
            localField: "correspondent",
            foreignField: "_id",
            as: "correspondentDetails",
          },
        },
        {
          $unwind: {
            path: "$correspondentDetails",
            preserveNullAndEmptyArrays: true, // Si aucun utilisateur correspondant, conserver le document.
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "creator",
            foreignField: "_id",
            as: "creatorDetails",
          },
        },
        {
          $unwind: {
            path: "$creatorDetails",
            preserveNullAndEmptyArrays: true, // Si aucun utilisateur correspondant, conserver le document.
          },
        },
        {
          $project: {
            _id: 1,
            creator: 1,
            correspondent: 1,
            messages: 1,
            "correspondentDetails.firstname": 1,
            "correspondentDetails.lastname": 1,
            "correspondentDetails.email": 1,
            "creatorDetails.firstname": 1,
            "creatorDetails.lastname": 1,
            "creatorDetails.email": 1,
          },
        },
      ])
      .toArray();

    res.json(conversationExists);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addMessage = async (req: Request, res: Response) => {
  try {
    const conversationCollection = await getCollection<Conversation>(
      "conversations"
    );
    const conversationId = new ObjectId(req.params.id);
    const userId = new ObjectId(req.params.userId);

    if (!req.body.text && !req.body.image) {
      res
        .status(400)
        .json({ message: "You should at least send a text or an image" });
      return;
    }

    if (req.body.text && typeof req.body.text !== "string") {
      res.status(400).json({ message: "Text must be a valid string" });
      return;
    }

    if (req.body.image && typeof req.body.image !== "string") {
      res.status(400).json({ message: "Image must be a valid string" });
      return;
    }

    if (!ObjectId.isValid(conversationId) || !ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Invalid conversation or user ID" });
      return;
    }

    const conversationExists = await conversationCollection.findOne({
      _id: conversationId,
    });

    if (!conversationExists) {
      res.status(404).json({ message: "Conversation not found" });
      return;
    }

    if (!validateConversationAccess(conversationExists, userId)) {
      res.status(403).json({
        message: "You are not authorized to send messages in this conversation",
      });
      return;
    }

    const newMessage: Message = {
      _id: new ObjectId(),
      sender: userId,
      text: req.body.text || null,
      image: req.body.image || null,
      createdAt: new Date(),
    };

    const receiverId = conversationExists.correspondent;
    const receiverSocketId = connectedUsers.get(receiverId.toString());

    try {
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("private_message", newMessage);
      } else {
        console.info("User disconnected, message saved");
      }
    } catch (err) {
      console.error("Error emitting message via Socket.IO:", err);
    }

    const result = await conversationCollection.updateOne(
      { _id: conversationExists._id },
      { $push: { messages: newMessage } }
    );

    if (result.modifiedCount !== 1) {
      res.status(500).json({ message: "Failed to add message" });
      return;
    }

    res.json({
      message: "Message sent successfully",
      messageId: newMessage._id,
      conversationId: conversationExists._id,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteConversation = async (req: Request, res: Response) => {
  try {
    const conversationCollection = await getCollection<Conversation>(
      "conversations"
    );
    const conversationId = new ObjectId(req.params.id);

    if (!ObjectId.isValid(conversationId)) {
      res.status(400).json({ message: "Invalid conversation ID" });
      return;
    }

    const result = await conversationCollection.deleteOne({
      _id: conversationId,
    });

    if (result.deletedCount !== 1) {
      res
        .status(404)
        .json({ message: "Conversation not found or already deleted" });
      return;
    }

    res.json({ message: "Conversation deleted successfully" });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const conversationCollection = await getCollection<Conversation>(
      "conversations"
    );
    const conversationId = new ObjectId(req.params.id);
    const messageId = new ObjectId(req.params.messageId);

    if (!ObjectId.isValid(conversationId) || !ObjectId.isValid(messageId)) {
      res.status(400).json({ message: "Invalid conversation or message ID" });
      return;
    }

    const result = await conversationCollection.updateOne(
      { _id: conversationId },
      { $pull: { messages: { _id: messageId } } }
    );

    if (result.modifiedCount !== 1) {
      res.status(404).json({ message: "Message or conversation not found" });
      return;
    }

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
