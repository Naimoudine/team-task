import { NextFunction, Request, Response } from "express";
import { getCollection } from "../../mongoClient";
import { User } from "./userController";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userCollection = await getCollection<User>("users");
    if (!req.body.email || !req.body.password) {
      res.status(422).json({ message: "Email or Password are required" });
      return;
    }
    const user = await userCollection.findOne({ email: req.body.email });
    if (!user) {
      res.status(422).json({
        message:
          "We couldn't find an account matching the email and password you entered. Please check your email and password and try again.",
      });
      return;
    }
    const verified = await argon2.verify(user.password!, req.body.password);
    if (!verified) {
      res.status(422).json({
        message:
          "We couldn't find an account matching the email and password you entered. Please check your email and password and try again.",
      });
      return;
    }

    delete user.password;
    const token = jwt.sign(
      {
        sub: user._id,
      },
      process.env.APP_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("token", token, {
      secure: process.env.NODE_ENV !== "development",
      httpOnly: true,
      expires: dayjs().add(30, "days").toDate(),
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
};
