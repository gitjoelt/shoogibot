const TelegramBot = require("node-telegram-bot-api");
const config = require("./tgbotconfig.json");
const yesNo = require("./src/commands/yesno");
const yt = require("./src/commands/yt");
const start = require("./src/commands/start");
const help = require("./src/commands/help");
const urbandefine = require("./src/commands/urbandefine");
const spellcheck = require("./src/commands/spellcheck");
const imagesearch = require("./src/commands/imagesearch");

const bot = new TelegramBot(config.token, { polling: true });

// Commands
start(bot);
help(bot);
yesNo(bot);
yt(bot);
urbandefine(bot);
spellcheck(bot);
imagesearch(bot);
