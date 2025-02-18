import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

type RoomMap = Map<string, Set<string>>;

declare global {
  var __dirname: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const rooms: RoomMap = new Map();

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  let currentRoom: string | null = null;
  let currentUser: string | null = null;

  socket.on("join", ({ roomId, userName }: { roomId: string; userName: string }) => {
    if (currentRoom) {
      socket.leave(currentRoom);
      rooms.get(currentRoom)?.delete(currentUser!);
      io.to(currentRoom).emit("userJoined", Array.from(rooms.get(currentRoom) || []));
      
    }

    currentRoom = roomId;
    currentUser = userName;

    socket.join(roomId);

    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }

    rooms.get(roomId)?.add(userName);
    io.to(roomId).emit("userJoined", Array.from(rooms.get(currentRoom) || []));
    console.log("user joined", roomId)
  });

  socket.on("codeChange", ({ roomId, code }: { roomId: string; code: string }) => {
    socket.to(roomId).emit("codeUpdate", code);
  });

  socket.on("leaveRoom", () => {
    if (currentRoom && currentUser) {
      rooms.get(currentRoom)?.delete(currentUser);
      io.to(currentRoom).emit("userJoined", Array.from(rooms.get(currentRoom) || []));
      socket.leave(currentRoom);
      currentRoom = null;
      currentUser = null;
    }
  });

  socket.on("typing", ({ roomId, userName }: { roomId: string; userName: string }) => {
    socket.to(roomId).emit("userTyping", userName);
  });

  socket.on("languageChange", ({ roomId, language }: { roomId: string; language: string }) => {
    io.to(roomId).emit("languageUpdate", language);
  });

  socket.on("disconnect", () => {
    if (currentRoom && currentUser) {
      rooms.get(currentRoom)?.delete(currentUser);
      io.to(currentRoom).emit("userJoined", Array.from(rooms.get(currentRoom) || []));
    }
    console.log("User Disconnected");
  });
});

const port = process.env.PORT || 5080;

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

server.listen(port, () => {
  console.log(`Server is working on port ${port}`);
});
