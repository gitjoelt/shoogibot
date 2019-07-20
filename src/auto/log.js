const Usage = require("../../models/usage");
const helptext = require("../../data/helptext.json");

/**
 * When Active:
 * Log usage stats (When a user types a command, save that to the database)
 */

const log = msg => {
  const command = msg.text.match(/^\/[a-z]+/g);
  if (command) {
    const actualCommand = helptext.find(
      existingCommand => command[0] === existingCommand.command
    );
    if (actualCommand) {
      const usageItem = new Usage({
        chatId: msg.chat.id,
        userId: msg.from.id,
        username: msg.from.username,
        command: actualCommand.command
      });
      usageItem.save().catch(err => console.log(err));
    }
  }
};

module.exports = log;
