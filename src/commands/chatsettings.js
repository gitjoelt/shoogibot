const Defaults = require("../../models/defaults");

/**
 * Command: /chatsettings
 * Returns some information about the chatroom
 */

const chatsettings = bot => {
  bot.onText(/^\/chatsettings/, msg => {
    let autotemp = false;
    let autoweight = false;
    Defaults.find({ chatId: msg.chat.id }, (err, res) => {
      if (err) return console.error(err);
      if (res.length === 0) {
        const newDefault = new Defaults({
          chatId: msg.chat.id
        });
        newDefault
          .save()
          .then()
          .catch(error => console.error(error));
      } else {
        autotemp = res[0].autoConvertTemp;
        autoweight = res[0].autoConvertWeight;
      }
      const responseMsg = `[Chatroom Settings]
--------------------------------------------------
<b>Telegram Chat ID:</b> ${msg.chat.id}
<b>Telegram Chat Type:</b> ${msg.chat.type}
<b>Auto Convert Temperature:</b> ${autotemp ? "Active" : "Disabled"}
<b>Auto Convert Weight:</b> ${autoweight ? "Active" : "Disabled"}`;
      bot.sendMessage(msg.chat.id, responseMsg, { parse_mode: "HTML" });
    });
  });
};

module.exports = chatsettings;
