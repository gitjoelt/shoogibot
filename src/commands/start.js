/**
 * Command: /start
 * Greet the user with a welcome message and direct them to help commands
 */

const welcomeMsg = `
<b>Thanks for using Shoogibot!</b>\n
Please type /help for the full command list.
You can also check out the website at https://shoogibot.xyz`;

const start = bot => {
  bot.onText(/^\/start/, msg => {
    bot.sendMessage(msg.chat.id, welcomeMsg, { parse_mode: "html" });
  });
};

module.exports = start;
