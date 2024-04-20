const Group = require("../models/group.model");
const GroupMessage = require("../models/groupMessage.model");

class GroupController {
  createGroup(data) {
    return new Promise((res, rej) => {
      try {
        const newGroup = new Group({
          name: data.name,
          avatar: data.avatar,
          admin: data.admin,
          participants: data.participants,
        });
        newGroup
          .save()
          .then(async (success) => {
            const group = await Group.findById(newGroup._id).populate([
              {
                path: "groupMessages",
                populate: {
                  path: "sender",
                  model: "User",
                },
              },
              ,
              "admin",
              "participants",
            ]);
            res({
              msg: "group created",
              status: 1,
              group,
            });
          })
          .catch(
            rej({
              msg: "Unable to create group",
              status: 0,
            })
          );
      } catch (error) {
        rej({ msg: "Internal Server Error", status: 0 });
      }
    });
  }
  addMessage({ sender, groupId, content }) {
    return new Promise(async (res, rej) => {
      try {
        const group = await Group.findById(groupId);
        if (group) {
          const newMessage = new GroupMessage({
            groupId: groupId,
            sender: sender,
            content: content,
          });
          const msg = await newMessage.save();
          group.groupMessages.push(msg._id);
          await group.save();
          const popGroup = await Group.findById(groupId).populate([
            {
              path: "groupMessages",
              populate: {
                path: "sender",
                model: "User",
              },
            },
            ,
            "admin",
            "participants",
          ]);
          res({
            msg: "message sent successfully",
            status: 1,
            popGroup,
            msg,
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
  getGroup(user) {
    return new Promise(async (res, rej) => {
      try {
        const group = await Group.find({
          participants: { $all: [user] },
        }).populate([
          {
            path: "groupMessages",
            populate: {
              path: "sender",
              model: "User",
            },
          },
          ,
          "admin",
          "participants",
        ]);
        if (!group) {
          res({
            msg: "no groups found",
            status: 1,
            group: [],
          });
        }
        res({
          msg: "groups found",
          status: 1,
          group,
        });
      } catch (error) {
        console.log(error);
        rej({
          msg: "Internal Server Error",
          status: 0,
        });
      }
    });
  }
  getChat(groupId) {
    return new Promise(async (res, rej) => {
      try {
        const group = await Group.findById(groupId).populate([
          {
            path: "groupMessages",
            populate: {
              path: "sender",
              model: "User",
            },
          },
          ,
          "admin",
          "participants",
        ]);

        res({
          msg: "groups found",
          status: 1,
          group,
        });
      } catch (error) {
        console.log(error);
        rej({
          msg: "Internal Server Error",
          status: 0,
        });
      }
    });
  }
}

module.exports = GroupController;
