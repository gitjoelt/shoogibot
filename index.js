const TelegramBot = require("node-telegram-bot-api");
const { CronJob } = require("cron");
const mongoose = require("mongoose");
const config = require("./tgbotconfig");
const yesNo = require("./src/commands/yesno");
const yt = require("./src/commands/yt");
const start = require("./src/commands/start");
const help = require("./src/commands/help");
const urbandefine = require("./src/commands/urbandefine");
const spellcheck = require("./src/commands/spellcheck");
const search = require("./src/commands/search");
const imagesearch = require("./src/commands/imagesearch");
const autotemp = require("./src/commands/autotemp");
const autoweight = require("./src/commands/autoweight");
const system = require("./src/commands/system");
const chatsettings = require("./src/commands/chatsettings");
const insight = require("./src/commands/insight");
const stats = require("./src/commands/stats");
const remindme = require("./src/commands/remindme");
const showreminders = require("./src/commands/showreminders");
const rtp = require("./src/commands/rtp");
const rr = require("./src/commands/rr");
const quote = require("./src/commands/quote");
const corona = require("./src/commands/corona");
const temp = require("./src/auto/temp");
const weight = require("./src/auto/weight");
const log = require("./src/auto/log");
const sendremind = require("./src/cron/sendremind");

const appurl = process.env.APPURL;
let options = { polling: true };
let bot = null;

// running on Heroku or local
if (appurl) {
  const port = process.env.PORT;
  options = { webHook: { port } };
  bot = new TelegramBot(config.token, options);
  bot.setWebHook(`${appurl}/bot${config.token}`);
  console.log(`Running via webhook @ ${appurl}`);
} else {
  bot = new TelegramBot(config.token, options);
  console.log(`Running via polling (local mode)`);
}

mongoose
  .connect(config.mongoConnection, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

// Auto Messaging
bot.on("message", msg => {
  if (typeof msg.text === "string" || msg.text instanceof String) {
    log(msg);
    temp(bot, msg);
    weight(bot, msg);
  }
});

// Commands
start(bot);
help(bot);
yesNo(bot);
yt(bot);
urbandefine(bot);
spellcheck(bot);
search(bot);
imagesearch(bot);
autotemp(bot);
autoweight(bot);
system(bot);
chatsettings(bot);
insight(bot);
stats(bot);
remindme(bot);
showreminders(bot);
rtp(bot);
rr(bot);
quote(bot);
corona(bot);

// Cron Jobs
// Every 5 minutes
const jobFiveMin = new CronJob("0 */5 * * * *", () => {
  sendremind(bot);
  console.log("Cron Job -- sendremind executed");
});
jobFiveMin.start();
