import express from "express";
import { Server, Socket } from "socket.io";
import cors from "cors";
import { createServer } from "node:http";

const app = express();
app.use(cors());

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    },
});

io.on("connection", (socket: Socket) => {
    console.log("A user connected", socket.id);

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
    });
});

export { server, io, app };