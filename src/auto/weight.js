const Defaults = require("../../models/defaults");
const helper = require("../lib/helper");

/**
 * When Active:
 * Automatically converts pounds to kilograms or vice versa during conversation
 */

const weight = (bot, msg) => {
  Defaults.find({ chatId: msg.chat.id })
    .then(res => {
      if (res.length === 0) {
        return;
      }
      if (res[0].autoConvertWeight) {
        const lbsMatches = msg.text.match(/( |^)[0-9]+lbs( |$)/gim);
        const kgMatches = msg.text.match(/( |^)[0-9]+kg( |$)/gim);

        let msgResponse = "";
        if (lbsMatches) {
          lbsMatches.forEach(match => {
            msgResponse += `${match.trim()} ⟶ ${helper.weightMethods.lbstokg(
              match
                .toUpperCase()
                .replace("LBS", "")
                .trim()
            )}kg\n`;
          });
        }
        if (kgMatches) {
          kgMatches.forEach(match => {
            msgResponse += `${match.trim()} ⟶ ${helper.weightMethods.kgtolbs(
              match
                .toUpperCase()
                .replace("KG", "")
                .trim()
            )}lbs\n`;
          });
        }
        if (msgResponse) {
          msgResponse +=
            "\n<i>Automatic weight conversions are active. To disable it type /autoweight</i>";
          bot.sendMessage(msg.chat.id, msgResponse, { parse_mode: "HTML" });
        }
      }
    })
    .catch(err => {
      console.error(err);
    });
};

module.exports = weight;
