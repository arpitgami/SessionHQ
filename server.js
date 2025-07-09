import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT || "3000", 10); // Respect environment PORT

const app = next({ dev }); // REMOVE hostname
const handler = app.getRequestHandler();

console.log("server.js is running...");

app.prepare().then(() => {
    const httpServer = createServer(handler);
    const io = new Server(httpServer, {
        cors: {
            origin: "*", // optional, or restrict to your domain
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("new user joined");

        socket.on("join-room", (roomid, peerid) => {
            socket.join(roomid);
            socket.roomsID = roomid;
            socket.peerId = peerid;
            console.log("user joined a room", roomid);
            socket.to(roomid).emit("new-user-joined", peerid);
        });

        socket.on("send-message", ({ user, message, roomid }) => {
            io.to(roomid).emit("message-received", {
                user: user,
                message: message
            });
        });

        socket.on("disconnect", () => {
            const roomId = socket.roomsID;
            const peerId = socket.peerId;
            console.log("user left", roomId, peerId);
            socket.to(roomId).emit("user-left", peerId);
        });

        socket.on("screen-sharing-status", (roomid, status) => {
            socket.to(roomid).emit("user-sharing-screen-status", status);
        });

        socket.on("user-ended-meeting", (roomid) => {
            socket.to(roomid).emit("meeting-ended");
        });
    });

    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on port ${port}`);
        });
});
