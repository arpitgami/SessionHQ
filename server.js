import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();


console.log("server.js is running...");


app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer);

    io.on("connection", (socket) => {
        console.log("new user joined");

        socket.on("join-room", (roomid, peerid) => {
            socket.join(roomid);
            socket.peerId = peerid;
            console.log("user joined a room", roomid);
            socket.to(roomid).emit("new-user-joined", peerid)
        })
        socket.on("send-message", ({ user, message, roomid }) => {
            io.to(roomid).emit("message-received", {
                user: user,
                message: message
            });
        })

        socket.on('disconnect', () => {
            const roomId = [...socket.rooms][1];

            const peerId = socket.peerId;

            socket.to(roomId).emit('user-left', peerId);

        });

    });

    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});