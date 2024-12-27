import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    auth?: string | JwtPayload; // Adjust type based on your expected `auth` payload
  }
}

import "socket.io";

declare module "socket.io" {
  interface Socket {
    user?: any; // Remplacez `any` par le type exact de vos données utilisateur
  }
}
