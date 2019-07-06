const Defaults = require("../../models/defaults");
const helper = require("../lib/helper");

/**
 * When Active:
 * Automatically converts celcius to fahrenheit or vice versa during conversation
 */

const temp = (bot, msg) => {
  Defaults.find({ chatId: msg.chat.id })
    .then(res => {
      if (res.length === 0) {
        return;
      }
      if (res[0].autoConvertTemp) {
        const farMatches = msg.text.match(/( |^)[0-9]+[f]( |$)/gim);
        const celMatches = msg.text.match(/( |^)[0-9]+[c]( |$)/gim);

        let msgResponse = "";
        if (farMatches) {
          farMatches.forEach(match => {
            msgResponse += `${match
              .toUpperCase()
              .trim()} ⟶ ${helper.tempMethods.ftoc(
              match
                .toUpperCase()
                .replace("F", "")
                .trim()
            )}C\n`;
          });
        }
        if (celMatches) {
          celMatches.forEach(match => {
            msgResponse += `${match
              .toUpperCase()
              .trim()} ⟶ ${helper.tempMethods.ctof(
              match
                .toUpperCase()
                .replace("C", "")
                .trim()
            )}F\n`;
          });
        }
        if (msgResponse) {
          msgResponse +=
            "\n<i>Automatic temperature conversions are active. To disable it type /autotemp</i>";
          bot.sendMessage(msg.chat.id, msgResponse, { parse_mode: "HTML" });
        }
      }
    })
    .catch(err => {
      console.error(err);
    });
};

module.exports = temp;
