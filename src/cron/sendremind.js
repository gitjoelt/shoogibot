const Remind = require("../../models/remind");

/**
 * Look for any reminders to be triggered and send them to the users, then delete the reminder from the DB
 */

const sendremind = bot => {
  Remind.find({}, (err, res) => {
    if (err) return console.error(err);
    let reminderMessage = "";
    const rightNow = new Date().getTime() / 1000;
    res.forEach(reminder => {
      if (rightNow > reminder.triggerdate) {
        reminderMessage = `Hey @${reminder.username}\nYou wanted to be reminded of this:\n\n${reminder.reminder}`;
        bot.sendMessage(reminder.chatId, reminderMessage);
        Remind.deleteOne({ _id: reminder._id }, error => {
          if (error) return console.log(error);
        });
      }
    });
  });
};

module.exports = sendremind;
