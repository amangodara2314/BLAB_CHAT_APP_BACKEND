const User = require("../models/user.model");
const { encryptPassword, decryptPassword } = require("../utils/encrypt");

class UserController {
  signUp(data) {
    return new Promise(async (res, rej) => {
      try {
        const existingUser = await User.findOne({ email: data.email });
        if (!existingUser) {
          const user = new User({
            username: data.username,
            email: data.email,
            password: encryptPassword(data.password),
            about: data.about,
            avatar: data.avatars,
          });
          user.save();
          res({
            msg: "account created",
            status: 1,
            user,
          });
        } else {
          rej({
            msg: "Email Already Exists",
            status: 0,
          });
        }
      } catch (error) {
        console.log(error);
        rej({
          msg: "Internal Server Error",
          status: 0,
        });
      }
    });
  }
  getUsers(query, id) {
    return new Promise(async (res, rej) => {
      try {
        const users = await User.find({
          email: { $regex: `${query}`, $options: "i" },
        });

        const searchedUsers = users.filter((u) => u.email != id);
        if (searchedUsers.length > 0) {
          res({
            msg: "Users found",
            searchedUsers,
          });
        } else {
          res({
            msg: "No users found",
            searchedUsers: [],
          });
        }
      } catch (error) {
        rej({
          msg: "Internal Server Error",
          status: 0,
        });
      }
    });
  }
  login(data) {
    return new Promise(async (res, rej) => {
      try {
        const user = await User.findOne({ email: data.email });
        if (!user) {
          rej({
            msg: "Email Does Not Exist",
            status: 0,
          });
        } else {
          if (decryptPassword(user.password) != data.password) {
            rej({
              msg: "Invalid Password",
              status: 0,
            });
          } else {
            res({
              msg: "Logged in successfully",
              status: 1,
              user,
            });
          }
        }
      } catch (error) {
        console.log(error);
        rej({
          msg: "Internal Server Error",
          status: 0,
        });
      }
    });
  }
  getFriends(userId) {
    return new Promise(async (res, rej) => {
      try {
        const user = await User.findById(userId).populate(["friends"]);
        if (user) {
          const friends = user.friends;
          res({
            msg: "Friends Found",
            status: 1,
            friends,
          });
        }
      } catch (error) {
        console.log(error);
        rej({
          msg: "Internal Server Error",
          status: 0,
        });
      }
    });
  }
  setAbout(userId, { about }) {
    return new Promise(async (res, rej) => {
      try {
        console.log(about);
        const user = await User.findByIdAndUpdate(userId, { about: about });
        console.log(user);
        res({
          msg: "updated successfully",
          status: 1,
          user,
        });
      } catch (error) {
        console.log(error);
        rej({ msg: "Internal Server Error", status: 0 });
      }
    });
  }
}

module.exports = UserController;
