import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server);

io.on('connection', (socket) => {
    socket.on('send-user-id', (id) => {
        socket.join(id);
    });
});

export { app, server, io }