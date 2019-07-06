const osbasic = require("os");
const os = require("os-utils");

const mode = process.env.APPURL ? "Production" : "Developer";
const telegramAPIMethod = process.env.APPURL ? "Webhooks" : "Polling";
const uptime = Math.floor(osbasic.uptime() / 3600);
const uptimehours = uptime > 1 || uptime === 0 ? "hours" : "hour";

const system = bot => {
  bot.onText(/^\/system/, msg => {
    os.cpuUsage(usage => {
      const responsemsg = `[System]
--------------------------------------------------
<b>Running:</b> ${process.title} ${process.version}
<b>Platform:</b> ${os.platform()} ${process.arch}
<b>Uptime:</b> ${uptime} ${uptimehours}
<b>Load Average (last 15 mins):</b> ${Math.round(os.loadavg(15) * 100)}%

[Telegram and Bot Settings]
--------------------------------------------------
<b>Telegram Connection:</b> ${telegramAPIMethod}
<b>Mode:</b> ${mode}
<b>Port:</b> ${process.env.PORT}

[Processor]
--------------------------------------------------
<b>CPU Model:</b> ${osbasic.cpus()[0].model}
<b>No of CPUs:</b> ${os.cpuCount()}
<b>CPU Usage:</b> ${Math.round(usage * 100)}%

[Memory]
--------------------------------------------------
<b>Total Memory:</b> ${Math.floor(os.totalmem())}MB
<b>Free Memory:</b> ${Math.round(os.freememPercentage() * 100)}%`;
      bot.sendMessage(msg.chat.id, responsemsg, { parse_mode: "HTML" });
    });
  });
};

module.exports = system;
