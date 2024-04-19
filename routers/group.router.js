const { Router } = require("express");
const GroupController = require("../controllers/group.controller");
const GroupRouter = Router();

GroupRouter.post("/send-message/:groupId", (req, res) => {
  new GroupController()
    .addMessage(req.body)
    .then((success) => {
      res.send(success);
    })
    .catch((err) => res.send(err));
});

GroupRouter.post("/create-group", (req, res) => {
  new GroupController()
    .createGroup(req.body)
    .then((success) => {
      res.send(success);
    })
    .catch((err) => res.send(err));
});

GroupRouter.get("/get-chat/:groupId", (req, res) => {
  new GroupController()
    .getChat(req.params.groupId)
    .then((success) => {
      res.send(success);
    })
    .catch((err) => res.send(err));
});

GroupRouter.get("/get-group/:userId", (req, res) => {
  new GroupController()
    .getGroup(req.params.userId)
    .then((success) => {
      res.send(success);
    })
    .catch((err) => res.send(err));
});

module.exports = GroupRouter;
