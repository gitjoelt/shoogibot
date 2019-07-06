const Defaults = require("../../models/defaults");

/**
 * Command: /autotemp
 * Toggles auto conversion of celcius to fahrenheit or vice versa during conversation
 */

const autotemp = bot => {
  bot.onText(/^\/autotemp/, msg => {
    Defaults.find({ chatId: msg.chat.id }, (err, res) => {
      if (err) return console.error(err);
      if (res.length === 0) {
        const newDefault = new Defaults({
          chatId: msg.chat.id,
          autoConvertTemp: true
        });
        newDefault
          .save()
          .then(() => {
            bot.sendMessage(
              msg.chat.id,
              `Auto [Celsius ⟷ Fahrenhiet] conversion: <b>Active</b>`,
              { parse_mode: "HTML" }
            );
          })
          .catch(error => console.error(error));
      } else {
        Defaults.updateOne(
          { chatId: msg.chat.id },
          { autoConvertTemp: !res[0].autoConvertTemp }
        )
          .then(() => {
            const isOn = !res[0].autoConvertTemp;
            bot.sendMessage(
              msg.chat.id,
              `Auto [Celsius ⟷ Fahrenhiet] conversion: <b>${
                isOn ? "Active" : "Disabled"
              }</b>`,
              { parse_mode: "HTML" }
            );
          })
          .catch(error => console.error(error));
      }
    });
  });
};

module.exports = autotemp;
