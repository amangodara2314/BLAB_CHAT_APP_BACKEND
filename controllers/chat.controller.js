const Chat = require("../models/chat.model");
const Message = require("../models/message.model");

class ChatController {
  addMessage({ sender, recipient, content }, attachment) {
    return new Promise(async (resolve, reject) => {
      try {
        let chat = await Chat.findOne({
          participants: { $all: [sender, recipient] },
        });

        if (!chat) {
          chat = new Chat({
            participants: [sender, recipient],
          });
        }

        let data = {
          ChatId: chat._id,
          sender: sender,
          recipient: recipient,
          content: content ? content : "",
        };
        if (attachment) {
          const imageName = Date.now() + "." + attachment.name.split(".").pop();
          const destination = "./uploads/" + imageName;

          attachment.mv(destination, (err) => {
            if (err) {
              reject({ msg: "Unable to upload image", status: 0 });
              return;
            }
          });
          data.attachment = imageName;
        }

        const newMessage = new Message(data);
        const msg = await newMessage.save();
        chat.messages.push(msg._id);
        await chat.save();

        const popChat = await Chat.findOne({
          participants: { $all: [sender, recipient] },
        }).populate("messages");

        resolve({
          msg: "Message sent successfully",
          status: 1,
          popChat,
        });
      } catch (error) {
        console.log(error);
        reject({ msg: "Internal Server Error", status: 0 });
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

  sendReaction({ messageId, reaction }) {
    return new Promise(async (res, rej) => {
      try {
        const msg = await Message.findById(messageId);
        msg.reaction = reaction;
        await msg.save();
        res({
          msg: "reaction send successfully",
          status: 1,
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

module.exports = ChatController;
