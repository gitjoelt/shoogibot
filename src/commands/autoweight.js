const Defaults = require("../../models/defaults");

/**
 * Command: /autotemp
 * Toggles auto conversion of pounds to kilograms or vice versa during conversation
 */

const autoweight = bot => {
  bot.onText(/^\/autoweight/, msg => {
    Defaults.find({ chatId: msg.chat.id }, (err, res) => {
      if (err) return console.error(err);
      if (res.length === 0) {
        const newDefault = new Defaults({
          chatId: msg.chat.id,
          autoConvertWeight: true
        });
        newDefault
          .save()
          .then(() => {
            bot.sendMessage(
              msg.chat.id,
              `Auto [Pounds ⟷ Kilograms] conversion: <b>Active</b>`,
              { parse_mode: "HTML" }
            );
          })
          .catch(error => console.error(error));
      } else {
        Defaults.updateOne(
          { chatId: msg.chat.id },
          { autoConvertWeight: !res[0].autoConvertWeight }
        )
          .then(() => {
            const isOn = !res[0].autoConvertWeight;
            bot.sendMessage(
              msg.chat.id,
              `Auto [Pounds ⟷ Kilograms] conversion: <b>${
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

module.exports = autoweight;
