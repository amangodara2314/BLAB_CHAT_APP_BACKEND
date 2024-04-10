const { Router } = require("express");
const FriendRequestController = require("../controllers/friend.controller");
const friendRouter = Router();

friendRouter.get("/get/:id", (req, res) => {
  new FriendRequestController()
    .getReq(req.params.id)
    .then((success) => res.send(success))
    .catch((err) => res.send(err));
});

friendRouter.put("/accept-req/:id/:user/:flag", (req, res) => {
  new FriendRequestController()
    .acceptReq(req.params.id, req.params.user, req.params.flag)
    .then((success) => res.send(success))
    .catch((err) => res.send(err));
});

module.exports = friendRouter;
