const { Router } = require("express");
const GroupController = require("../controllers/group.controller");
const GroupRouter = Router();
const fileUpload = require("express-fileupload");

GroupRouter.post(
  "/send-message/:groupId",
  fileUpload({
    createParentPath: true,
  }),
  (req, res) => {
    new GroupController()
      .addMessage(req.body, req.files?.file)
      .then((success) => {
        res.send(success);
      })
      .catch((err) => res.send(err));
  }
);

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

GroupRouter.put("/add-member/:groupId", (req, res) => {
  new GroupController()
    .addMember(req.params.groupId, req.body)
    .then((success) => {
      res.send(success);
    })
    .catch((err) => res.send(err));
});

GroupRouter.put("/remove-member/:groupId", (req, res) => {
  new GroupController()
    .removeMember(req.params.groupId, req.body)
    .then((success) => {
      res.send(success);
    })
    .catch((err) => res.send(err));
});

GroupRouter.delete("/delete-group/:groupId", (req, res) => {
  new GroupController()
    .deleteGroup(req.params.groupId)
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
