const Usage = require("../../models/usage");

/**
 * Command: /stats
 * Display usage stats from the database
 */

const stats = bot => {
  bot.onText(/^\/stats/, msg => {
    let responseMsg = "";
    Usage.find({}, (err, res) => {
      if (err) {
        console.log(err);
        return;
      }
      if (res.length > 0) {
        const chatRooms = [...new Set(res.map(record => record.chatId))];
        const users = [...new Set(res.map(record => record.userId))];
        responseMsg = `[General Stats]
--------------------------------------------------
<b>Unique Chatrooms:</b> ${chatRooms.length}
<b>Unique Users:</b> ${users.length}
<b>Commands Executed:</b> ${res.length + 1}\n
<i>Usage numbers are tallied on users that have issued at least one command</i>`;
      } else {
        responseMsg = `No usage stats recorded yet.`;
      }
      bot.sendMessage(msg.chat.id, responseMsg, { parse_mode: "html" });
    });
  });
};

module.exports = stats;
