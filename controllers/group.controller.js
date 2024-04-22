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
          .catch((err) => {
            rej({
              msg: "Unable to create group",
              status: 0,
            });
          });
      } catch (error) {
        rej({ msg: "Internal Server Error", status: 0 });
      }
    });
  }
  addMessage({ sender, groupId, content }, attachment) {
    return new Promise(async (res, rej) => {
      try {
        const group = await Group.findById(groupId);
        if (group) {
          const data = {
            groupId: groupId,
            sender: sender,
            content: content ? content : "",
          };
          if (attachment) {
            const imageName =
              Date.now() + "." + attachment.name.split(".").pop();
            const destination = "./uploads/" + imageName;

            attachment.mv(destination, (err) => {
              if (err) {
                reject({ msg: "Unable to upload image", status: 0 });
                return;
              }
            });
            data.attachment = imageName;
          }
          const newMessage = new GroupMessage(data);
          const msgId = await newMessage.save();
          group.groupMessages.push(msgId._id);
          await group.save();
          const msg = await GroupMessage.findById(msgId._id).populate("sender");
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
  addMember(groupId, member) {
    return new Promise(async (res, rej) => {
      try {
        console.log(member);
        const grp = await Group.findById(groupId);
        member.forEach((element) => {
          grp.participants.push(element);
        });
        await grp.save();

        const group = await Group.findById(grp._id).populate([
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
        res({ msg: "member added successfully", group, status: 1 });
      } catch (error) {
        rej({ msg: "Internal Server Error", status: 0 });
      }
    });
  }
  removeMember(groupId, { memberId }) {
    return new Promise(async (res, rej) => {
      try {
        console.log(memberId);
        const grp = await Group.findById(groupId);
        const filtered = grp.participants.filter((p) => p._id != memberId);
        grp.participants = filtered;
        await grp.save();

        const group = await Group.findById(grp._id).populate([
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
        res({ msg: "member removed successfully", group, status: 1 });
      } catch (error) {
        console.log(error);
        rej({ msg: "Internal Server Error", status: 0 });
      }
    });
  }
  deleteGroup(groupId) {
    return new Promise((res, rej) => {
      try {
        Group.deleteOne({ _id: groupId })
          .then((success) =>
            res({ msg: "group deleted successfully", status: 1 })
          )
          .catch((err) => rej({ msg: "Unable To Delete Group" }));
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
