const { Router } = require("express");
const ChatController = require("../controllers/chat.controller");
const ChatRouter = Router();
const fileUpload = require("express-fileupload");

ChatRouter.post(
  "/send-message",
  fileUpload({
    createParentPath: true,
  }),
  (req, res) => {
    new ChatController()
      .addMessage(req.body, req.files?.file)
      .then((success) => {
        res.send(success);
      })
      .catch((err) => res.send(err));
  }
);

ChatRouter.get("/get-chat/:userA/:userB", (req, res) => {
  new ChatController()
    .getChat(req.params.userA, req.params.userB)
    .then((success) => {
      res.send(success);
    })
    .catch((err) => res.send(err));
});

ChatRouter.put("/send-reaction", (req, res) => {
  new ChatController()
    .sendReaction(req.body)
    .then((success) => {
      res.send(success);
    })
    .catch((err) => res.send(err));
});

module.exports = ChatRouter;
