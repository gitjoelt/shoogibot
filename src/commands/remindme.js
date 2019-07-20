const strtotime = require("locutus/php/datetime/strtotime");
const Remind = require("../../models/remind");
const helper = require("../lib/helper");

/**
 * The user enters a date and time when to be reminded, and save it to the database in unix timestamp format.
 */

const remindme = bot => {
  bot.onText(/^\/remindme/, msg => {
    let reminder = helper.removeCommandText("/remindme", msg.text);
    if (!reminder) {
      bot.sendMessage(
        msg.chat.id,
        "<b>Please enter when to be reminded, and your reminder message.</b>\nExample: /remindme 1 hour; Do laundry",
        { parse_mode: "html" }
      );
      return;
    }
    reminder = reminder.split(";");
    const remindDate = strtotime(reminder[0]);
    const remindText = reminder[1].trim();
    if (remindDate && remindText) {
      const remindItem = new Remind({
        chatId: msg.chat.id,
        userId: msg.from.id,
        username: msg.from.username,
        reminder: remindText,
        triggerdate: remindDate
      });
      remindItem.save().catch(err => console.log(err));
      bot.sendMessage(
        msg.chat.id,
        "Got it!\nTo view active reminders type /showreminders",
        { parse_mode: "html" }
      );
    } else {
      bot.sendMessage(
        msg.chat.id,
        "Oops, I couldn't parse that date.\n\n<b>Examples:</b>\n/remindme 1 hour; do laundry\n/remindme July 10 2019; go to a concert",
        { parse_mode: "html" }
      );
    }
  });
};

module.exports = remindme;
