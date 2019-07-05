const helpText = require("../../data/helptext.json");

/**
 * Command: /help OR /commands
 * Lists off each command this bot is capable of and how to use them
 * Pulls command information from /data/helptext.json
 */

let helpMsg = "";
const alphabetize = (a, b) => {
  if (a.command > b.command) {
    return 1;
  }
  if (a.command < b.command) {
    return -1;
  }
  return 0;
};

helpText.sort(alphabetize);

helpText.forEach(commandInfo => {
  helpMsg += `${commandInfo.command}\n<i>${commandInfo.description}</i>\n<code>${commandInfo.usage}</code>\n\n`;
});

const help = bot => {
  bot.onText(/^\/help|^\/commands/, msg => {
    bot.sendMessage(msg.chat.id, helpMsg, { parse_mode: "html" });
  });
};

module.exports = help;
