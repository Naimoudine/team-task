import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./app";
import { socketVerifyToken } from "./middlewares/socketToken";

const PORT = process.env.PORT;
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

socketVerifyToken();

export const connectedUsers = new Map<string, string>();

io.on("connection", (socket) => {
  if (socket.user && socket.user.id) {
    connectedUsers.set(socket.user.id, socket.id);
    console.log("User has connected", socket.user.id, socket.id);
  } else {
    console.log("Failed to connect user, missing user information");
  }

  socket.on("disconnect", () => {
    if (socket.user && socket.user.id) {
      connectedUsers.delete(socket.user.id);
      console.log("User disconnected", socket.user.id);
    }
  });
});

server.listen(PORT, () => {
  console.info(`server is running on PORT http://localhost:${PORT}`);
});
