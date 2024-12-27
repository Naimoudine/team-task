import "dotenv/config";
import { io } from "..";
import cookie from "cookie";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.APP_SECRET!;

export const socketVerifyToken = () => {
  console.log("appelé");
  io.use((socket, next) => {
    console.log("Checking token...");

    const cookies = socket.handshake.headers.cookie;
    console.log("Cookies received:", cookies);

    if (!cookies) {
      return next(new Error("No cookies found"));
    }

    const parsedCookies = cookie.parse(cookies);
    const token = parsedCookies.token;

    if (!token) {
      return next(new Error("Authentication error: No token found in cookies"));
    }

    try {
      // Vérifie et décode le token
      const decoded = jwt.verify(token, SECRET_KEY);

      console.log("Decoded token:", decoded); // Ajoutez ceci pour voir ce qui est décodé

      // Assurez-vous que le token contient bien un champ 'id' ou 'sub'
      socket.user = decoded; // Associe l'utilisateur au socket

      // Si vous n'avez pas de 'id' dans le token, utilisez 'sub' ou le champ correct du token
      if (!socket.user.id && decoded.sub) {
        socket.user.id = decoded.sub; // Si le token a 'sub', utilisez-le comme 'id'
      }

      next(); // Passe au prochain middleware
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });
};
