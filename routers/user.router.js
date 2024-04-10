const { Router } = require("express");
const UserController = require("../controllers/user.controller");

const UserRouter = Router();

UserRouter.post("/create-user", (req, res) => {
  new UserController()
    .signUp(req.body)
    .then((success) => res.send(success))
    .catch((err) => res.send(err));
});

UserRouter.get("/get-users/:query/:id", (req, res) => {
  new UserController()
    .getUsers(req.params.query, req.params.id)
    .then((success) => res.send(success))
    .catch((err) => res.send(err));
});

UserRouter.post("/login", (req, res) => {
  new UserController()
    .login(req.body)
    .then((success) => res.send(success))
    .catch((err) => res.send(err));
});

UserRouter.get("/get-friends/:userId", (req, res) => {
  new UserController()
    .getFriends(req.params.userId)
    .then((success) => res.send(success))
    .catch((err) => res.send(err));
});

module.exports = UserRouter;
