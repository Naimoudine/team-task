import { NextFunction, Request, Response } from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 19 * 2 ** 10,
  timeCost: 2,
  parallelism: 1,
};

export const hashPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body.password) {
      res.status(404).json({ message: "Password is missing" });
      return;
    }
    const hashedPassword = await argon2.hash(req.body.password, hashingOptions);
    delete req.body.password;
    req.body.hashedPassword = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
};

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      res.sendStatus(403);
      return;
    }
    req.auth = jwt.verify(token, process.env.APP_SECRET as string);
    next();
  } catch (error) {
    res.sendStatus(401);
    next(error);
  }
};
