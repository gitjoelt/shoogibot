const Remind = require("../../models/remind");

/**
 * Display all the reminders for the current chatroom
 */

const showreminders = bot => {
  bot.onText(/^\/showreminders/, msg => {
    let responseMsg = "";
    Remind.find({ chatId: msg.chat.id }, (err, res) => {
      if (err) return console.log(err);
      let triggerDate = "";
      res.sort((a, b) => a.triggerdate - b.triggerdate);
      res.forEach(reminder => {
        triggerDate = new Date(reminder.triggerdate * 1000).toString();
        responseMsg += `${reminder.username} ⟶ <i>${reminder.reminder}</i>\n<b>Trigger:</b> ${triggerDate}\n\n`;
      });
      if (!responseMsg) {
        responseMsg = "There are no active reminders in this chatroom.";
      }
      bot.sendMessage(msg.chat.id, responseMsg, { parse_mode: "html" });
    });
  });
};

module.exports = showreminders;
