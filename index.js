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
app.use(express.static("uploads"));
app.use(cors());
require("dotenv").config();
const MONGODB = process.env.MONGODB;
const UserRouter = require("./routers/user.router");
const { handleUserConnection, userSocketMap } = require("./utils/IDmanagement");
const friendRouter = require("./routers/friend.router");
const ChatRouter = require("./routers/chat.router");
const GroupRouter = require("./routers/group.router");

app.use("/user", UserRouter);
app.use("/friend", friendRouter);
app.use("/chat", ChatRouter);
app.use("/group", GroupRouter);

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
  socket.on("join_room", (id) => {
    socket.join(id);
  });
  socket.on("new-group", (data) => {
    const { members } = data;
    members.forEach((memberId) => {
      const recipientSocketId = userSocketMap.get(memberId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("groupAddedNotification", {
          group: data.group,
        });
      }
    });
  });
  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
  });
  socket.on("groupMessageNotification", (data) => {
    const { members } = data;
    let offline = [];
    const socketIdsInRoom = io.of("/").adapter.rooms.get(data.group);

    if (socketIdsInRoom) {
      const socketIdsArray = Array.from(socketIdsInRoom);
      members.forEach((memberId) => {
        const recipientSocketId = userSocketMap.get(memberId._id.toString());
        if (socketIdsArray.includes(recipientSocketId)) {
          offline.push(memberId._id);
          io.to(recipientSocketId).emit("groupMessage", {
            data,
            offlineUser: offline,
          });
        } else {
          io.to(recipientSocketId).emit("newGroupMessage", data);
        }
      });
    } else {
      console.log("Room does not exist");
    }
  });
  socket.on("removed", ({ memberId, group }) => {
    const recipientSocketId = userSocketMap.get(memberId);
    io.to(recipientSocketId).emit("removedFromGroup", group);
  });
  socket.on("deleted", ({ memberId, group }) => {
    const { members } = data;
    members.forEach((memberId) => {
      const recipientSocketId = userSocketMap.get(memberId._id.toString());
      io.to(recipientSocketId).emit("groupDeleted", group);
    });
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
