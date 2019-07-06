const TelegramBot = require("node-telegram-bot-api");
const mongoose = require("mongoose");
const config = require("./tgbotconfig.json");
const yesNo = require("./src/commands/yesno");
const yt = require("./src/commands/yt");
const start = require("./src/commands/start");
const help = require("./src/commands/help");
const urbandefine = require("./src/commands/urbandefine");
const spellcheck = require("./src/commands/spellcheck");
const imagesearch = require("./src/commands/imagesearch");
const autotemp = require("./src/commands/autotemp");
const autoweight = require("./src/commands/autoweight");
const temp = require("./src/auto/temp");
const weight = require("./src/auto/weight");

const bot = new TelegramBot(config.token, { polling: true });
mongoose
  .connect(config.mongoConnection, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

// Auto Messaging
bot.on("message", msg => {
  temp(bot, msg);
  weight(bot, msg);
});

// Commands
start(bot);
help(bot);
yesNo(bot);
yt(bot);
urbandefine(bot);
spellcheck(bot);
imagesearch(bot);
autotemp(bot);
autoweight(bot);
