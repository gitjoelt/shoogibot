/**
 * Command: /yesno
 * User asks a question and the bot replies
 * with a yes or no
 */

const yesNo = bot => {
  bot.onText(/^\/yesno/, msg => {
    const randomNum = Math.floor(Math.random() * Math.floor(2));
    if (randomNum === 1) {
      bot.sendMessage(msg.chat.id, "Yes");
    } else {
      bot.sendMessage(msg.chat.id, "No");
    }
    return null;
  });
};

module.exports = yesNo;
