import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./app";

const PORT = process.env.PORT;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

io.on("connect", (socket) => {});

server.listen(PORT, () => {
  console.info(`server is running on PORT http://localhost:${PORT}`);
});
