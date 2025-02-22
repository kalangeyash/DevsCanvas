import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});
const rooms = new Map();
io.on("connection", (socket) => {
    console.log("User Connected", socket.id);
    let currentRoom = null;
    let currentUser = null;
    socket.on("join", ({ roomId, userName }) => {
        if (currentRoom) {
            socket.leave(currentRoom);
            rooms.get(currentRoom)?.users.delete(currentUser); // ✅ Fix: Correctly deleting user
            io.to(currentRoom).emit("userJoined", Array.from(rooms.get(currentRoom)?.users || []));
        }
        currentRoom = roomId;
        currentUser = userName;
        socket.join(roomId);
        if (!rooms.has(roomId)) {
            rooms.set(roomId, { users: new Set() });
        }
        rooms.get(roomId)?.users.add(userName);
        io.to(roomId).emit("userJoined", Array.from(rooms.get(currentRoom)?.users || []));
    });
    socket.on("codeChange", ({ roomId, code }) => {
        socket.to(roomId).emit("codeUpdate", code);
    });
    socket.on("leaveRoom", () => {
        if (currentRoom && currentUser) {
            const room = rooms.get(currentRoom);
            if (room) {
                room.users.delete(currentUser); // ✅ Fix: Deleting user properly
                io.to(currentRoom).emit("userJoined", Array.from(room.users));
                if (room.users.size === 0) {
                    rooms.delete(currentRoom);
                }
            }
            socket.leave(currentRoom);
            currentRoom = null;
            currentUser = null;
        }
    });
    socket.on("typing", ({ roomId, userName }) => {
        socket.to(roomId).emit("userTyping", userName);
    });
    socket.on("languageChange", ({ roomId, language }) => {
        io.to(roomId).emit("languageUpdate", language);
    });
    socket.on("compileCode", async ({ code, roomId, language, version }) => {
        if (rooms.has(roomId)) {
            try {
                const room = rooms.get(roomId);
                const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
                    language,
                    version,
                    files: [{ content: code }],
                });
                if (room) {
                    room.output = response.data.run.output;
                }
                io.to(roomId).emit("codeResponse", response.data);
            }
            catch (error) {
                console.error("Compilation Error:", error);
                io.to(roomId).emit("codeResponse", { error: "Compilation failed" });
            }
        }
    });
    socket.on("disconnect", () => {
        if (currentRoom && currentUser) {
            rooms.get(currentRoom)?.users.delete(currentUser); // ✅ Fix: Correctly deleting user
            io.to(currentRoom).emit("userJoined", Array.from(rooms.get(currentRoom)?.users || []));
        }
        console.log("User Disconnected");
    });
});
const port = process.env.PORT || 5080;
app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});
server.listen(port, () => {
    console.log(`Server is working on port ${port}`);
});
