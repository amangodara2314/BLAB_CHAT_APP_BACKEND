const FriendRequest = require("../models/friend.model");
const User = require("../models/user.model");

class FriendRequestController {
  sendRequest({ recipientId, senderId }) {
    return new Promise(async (res, rej) => {
      try {
        const existingRequest = await FriendRequest.findOne({
          recipient: recipientId,
          sender: senderId,
          status: "pending",
        });
        if (!existingRequest) {
          const recipient = await User.findById(recipientId);
          const sender = await User.findById(senderId);

          const request = new FriendRequest({
            recipient: recipientId,
            sender: senderId,
          });
          await request.save();
          res({
            msg: "Friend Request Sent",
            status: 1,
            recipient,
            sender,
            requestId: request._id,
          });
        } else {
          rej({
            msg: "request already sent",
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
  getReq(id) {
    return new Promise(async (res, rej) => {
      try {
        const user = await FriendRequest.find({
          recipient: id,
          status: "pending",
        }).populate("sender");
        if (user) {
          res({
            msg: "req found",
            status: 1,
            user,
          });
        } else {
          res({
            msg: "No Request Yet",
            status: 0,
            user,
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
  acceptReq(reqId, userId, flag) {
    return new Promise(async (res, rej) => {
      try {
        let req = await FriendRequest.findById(reqId);
        if (flag == "true") {
          req.status = "accepted";
          req
            .save()
            .then(async (success) => {
              let user = await User.findById(userId);
              let sender = await User.findById(req.sender);
              if (
                !sender.friends.includes(req.recipient) &&
                !user.friends.includes(req.sender)
              ) {
                sender.friends.push(req.recipient);
                user.friends.push(req.sender);
                await user.save();
                await sender.save();
                res({
                  msg: "Added To Friend List",
                  status: 1,
                  sender: sender._id,
                });
              } else {
                rej({
                  msg: "User Already Exists",
                  status: 0,
                });
              }
            })
            .catch((err) => {
              rej({
                msg: "Unable To Accept Request Please Try Again Later",
                status: 0,
              });
            });
        } else {
          req.status = "rejected";
          req
            .save()
            .then((success) => {
              res({
                msg: "Rejected Successfully",
                status: 0,
              });
            })
            .catch((err) => {
              rej({
                msg: "Unable To Accept Request Please Try Again Later",
                status: 0,
              });
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
}

module.exports = FriendRequestController;
