const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  about: { type: String, default: "" },
  avatar: { type: String },
  friends: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
