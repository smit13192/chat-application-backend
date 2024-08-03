import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server);

const activeUsers: { [key: string]: string } = {};

io.on('connection', (socket) => {
    socket.on('send-user-id', (id) => {
        activeUsers[id] = socket.id;
        const activeUserIds = Object.keys(activeUsers);
        io.emit('active-user', activeUserIds);
        socket.join(id);
    });

    socket.on('disconnect', () => {
        const userId = Object.keys(activeUsers).find(id => activeUsers[id] === socket.id);
        if (userId) {
            delete activeUsers[userId];
            const activeUserIds = Object.keys(activeUsers);
            io.emit('active-user', activeUserIds);
        }
    });
});

export { app, express, io, server };
