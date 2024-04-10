const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = express();
const { Server } = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});
const FriendRequestController = require("./controllers/friend.controller");
app.use(express.json());
app.use(cors());
require("dotenv").config();
const MONGODB = process.env.MONGODB;
const UserRouter = require("./routers/user.router");
const { handleUserConnection, userSocketMap } = require("./utils/IDmanagement");
const friendRouter = require("./routers/friend.router");
const ChatRouter = require("./routers/chat.router");

app.use("/user", UserRouter);
app.use("/friend", friendRouter);
app.use("/chat", ChatRouter);

io.on("connection", (socket) => {
  handleUserConnection(socket);
  socket.on("send-request", (data) => {
    new FriendRequestController()
      .sendRequest(data)
      .then((success) => {
        if (success.status == 1) {
          const recipientSocketId = userSocketMap.get(
            success.recipient._id.toString()
          );
          io.to(recipientSocketId).emit("friendRequestReceived", {});
        }
      })
      .catch((err) => {});
  });
  socket.on("requestAccepted", (data) => {
    const recipientSocketId = userSocketMap.get(data);
    io.to(recipientSocketId).emit("fetchData", {});
  });
  socket.on("send-message", ({ recipient, sender }) => {
    const recipientSocketId = userSocketMap.get(recipient);
    io.to(recipientSocketId).emit("fetchChat", sender);
  });
});

mongoose
  .connect(MONGODB, { dbName: "blab-data" })
  .then(() => {
    server.listen(5000, () => {
      console.log("db connected and server started");
    });
  })
  .catch(() => {
    console.log("unable to connect");
  });
