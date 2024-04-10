const Chat = require("../models/chat.model");
const Message = require("../models/message.model");

class ChatController {
  addMessage({ sender, recipient, content }) {
    return new Promise(async (res, rej) => {
      try {
        const chat = await Chat.findOne({
          participants: { $all: [sender, recipient] },
        });
        if (chat) {
          const newMessage = new Message({
            ChatId: chat._id,
            sender: sender,
            recipient: recipient,
            content: content,
          });
          const msg = await newMessage.save();
          chat.messages.push(msg._id);
          await chat.save();
          const popChat = await Chat.findOne({
            participants: { $all: [sender, recipient] },
          }).populate("messages");
          res({
            msg: "message sent successfully",
            status: 1,
            popChat,
          });
        } else {
          const chat = new Chat({
            participants: [sender, recipient],
          });
          const newMessage = new Message({
            ChatId: chat._id,
            sender: sender,
            recipient: recipient,
            content: content,
          });
          const msg = await newMessage.save();
          chat.messages.push(msg._id);
          await chat.save();
          const popChat = await Chat.findOne({
            participants: { $all: [sender, recipient] },
          }).populate("messages");
          res({
            msg: "message sent succesfully",
            status: 1,
            popChat,
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
  getChat(userA, userB) {
    return new Promise(async (res, rej) => {
      try {
        const chat = await Chat.findOne({
          participants: { $all: [userA, userB] },
        }).populate("messages");
        if (!chat) {
          rej({
            msg: "Send message to start conversation",
            status: 0,
          });
        } else {
          res({
            msg: "chat found",
            status: 1,
            chat,
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
}

module.exports = ChatController;
