const { Router } = require("express");
const ChatController = require("../controllers/chat.controller");
const ChatRouter = Router();

ChatRouter.post("/send-message", (req, res) => {
  new ChatController()
    .addMessage(req.body)
    .then((success) => {
      res.send(success);
    })
    .catch((err) => res.send(err));
});

ChatRouter.get("/get-chat/:userA/:userB", (req, res) => {
  new ChatController()
    .getChat(req.params.userA, req.params.userB)
    .then((success) => {
      res.send(success);
    })
    .catch((err) => res.send(err));
});

module.exports = ChatRouter;
