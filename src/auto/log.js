const Usage = require("../../models/usage");

/**
 * When Active:
 * Log usage stats (When a user types a command, save that to the database)
 */

const log = msg => {
  const command = msg.text.match(/^\/[a-z]+/g);
  if (command) {
    const usageItem = new Usage({
      chatId: msg.chat.id,
      userId: msg.from.id,
      username: msg.from.username,
      command: command[0]
    });
    usageItem.save().catch(err => console.log(err));
  }
};

module.exports = log;
