const osbasic = require("os");
const si = require("systeminformation");
const helper = require("../lib/helper");

const mode = process.env.APPURL ? "Production" : "Developer";
const telegramAPIMethod = process.env.APPURL ? "Webhooks" : "Polling";
const uptime = Math.floor(osbasic.uptime() / 3600);
const uptimehours = uptime > 1 || uptime === 0 ? "hours" : "hour";
let herokudata = "";

if (process.env.DYNO) {
  herokudata = `[Heroku Dyno]
--------------------------------------------------
<b>ID:</b> ${process.env.DYNO}
<b>Shared:</b> ${process.env.SHARED ? "yes" : "no"}
<b>Usable Memory:</b> ${process.env.MEMORY_AVAILABLE}MB\n\n`;
}

const getSystemInformation = async () => {
  try {
    const dataOS = await si.osInfo();
    const dataLoad = await si.currentLoad();
    const dataCPU = await si.cpu();
    const dataCPUSpeed = await si.cpuCurrentspeed();
    const dataCPUTemp = await si.cpuTemperature();
    const dataMem = await si.mem();
    const dataGraphics = await si.graphics();
    const dataDisk = await si.diskLayout();
    const msgtext = `${herokudata}[System]
--------------------------------------------------
<b>Framework:</b> ${process.title} ${process.version}
<b>Platform:</b> ${dataOS.distro} ${dataOS.release}
<b>Uptime:</b> ${uptime} ${uptimehours}
<b>Load Average:</b> ${dataLoad.avgload.toFixed(2)}%
<b>Current Load:</b> ${dataLoad.currentload.toFixed(2)}%
${dataLoad.cpus
  .map((cpu, index) => {
    return `➥ Core ${index}: ${cpu.load.toFixed(2)}%`;
  })
  .join("\n")}

[Telegram and Bot Settings]
--------------------------------------------------
<b>Telegram Connection:</b> ${telegramAPIMethod}
<b>Mode:</b> ${mode}
<b>Port:</b> ${process.env.PORT}

[Processor]
--------------------------------------------------
<b>CPU Model:</b> ${dataCPU.manufacturer} ${dataCPU.brand} ${dataCPU.speed}GHz
<b>Cores:</b> ${dataCPU.cores || "N/A"}
<b>Socket:</b> ${dataCPU.socket || "N/A"}
<b>Avg Speed:</b> ${dataCPUSpeed.avg}GHz
<b>Avg Temp: </b> ${dataCPUTemp.main || "N/A"}
${dataCPUTemp.cores
  .map((temp, index) => {
    return `➥ Core ${index}: ${temp}`;
  })
  .join("\n")}

[Memory]
--------------------------------------------------
<b>Total Memory:</b> ${helper.readableBytes(dataMem.total)}
➥ Active: ${helper.readableBytes(dataMem.active)}
➥ Used: ${helper.readableBytes(dataMem.used)}
➥ Free: ${helper.readableBytes(dataMem.free)}

[Graphics]
--------------------------------------------------
${dataGraphics.controllers
  .map((controller, index) => {
    return `<b>Model (${index}):</b> ${controller.model ||
      "N/A"}\n<b>Vendor (${index}):</b> ${controller.vendor ||
      "N/A"}\n<b>VRAM (${index}):</b> ${controller.vram + "MB" || "N/A"}`;
  })
  .join("\n")}

[Disk]
--------------------------------------------------
${dataDisk
  .map((disk, index) => {
    return `<b>Vendor (${index}):</b> ${disk.vendor ||
      "N/A"}\n<b>Type (${index}):</b> ${disk.type ||
      "N/A"}\n<b>Size (${index}):</b> ${helper.readableBytes(disk.size) ||
      "N/A"}`;
  })
  .join("\n")}`;

    return msgtext;
  } catch (e) {
    throw e;
  }
};

const system = bot => {
  bot.onText(/^\/system/, msg => {
    getSystemInformation()
      .then(responsemsg => {
        bot.sendMessage(msg.chat.id, responsemsg, { parse_mode: "HTML" });
      })
      .catch(error => {
        bot.sendMessage(
          msg.chat.id,
          `<b>Oops something went wrong</b>\n<code>${error}</code>`,
          { parse_mode: "HTML" }
        );
      });
  });
};

module.exports = system;
