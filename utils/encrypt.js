const Cryptr = require("cryptr");
const cryptr = new Cryptr("blabchatappadmin");

const encryptPassword = (password) => {
  return cryptr.encrypt(password);
};
const decryptPassword = (password) => {
  return cryptr.decrypt(password);
};

module.exports = { encryptPassword, decryptPassword };
