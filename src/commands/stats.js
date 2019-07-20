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
        const commandUsage = {};
        let command = "";
        res.forEach(record => {
          command = record.command.replace("/", "");
          if (commandUsage[command]) {
            commandUsage[command] += 1;
          } else {
            commandUsage[command] = 1;
          }
        });

        const commandEntries = Object.entries(commandUsage);
        commandEntries.sort((a, b) => b[1] - a[1]);

        responseMsg = `[Global Stats]
--------------------------------------------------
<b>Unique Chatrooms:</b> ${chatRooms.length}
<b>Unique Users:</b> ${users.length}
<b>Commands Executed:</b> ${res.length}
${commandEntries
  .map(comm => {
    return `➥ ${comm[0]}: ${comm[1]}`;
  })
  .join("\n")}\n
<i>Each user and chatroom counted has issued at least one command</i>`;
      } else {
        responseMsg = `No usage stats recorded yet.`;
      }
      bot.sendMessage(msg.chat.id, responseMsg, { parse_mode: "html" });
    });
  });
};

module.exports = stats;
