const axios = require("axios");
const helper = require("../lib/helper");

/**
 * Command: /urbandefine [search Query]
 * Looks up the top search result on Urbandictonary.com using the UrbanDictonary API
 */

const urbandefine = bot => {
  bot.onText(/^\/urbandefine/, msg => {
    const query = encodeURI(helper.removeCommandText("/urbandefine", msg.text));
    if (!query) {
      bot.sendMessage(
        msg.chat.id,
        "<b>Please enter a search query.</b>\nExample: /urbandefine tree",
        { parse_mode: "html" }
      );
      return;
    }
    axios
      .get(`http://api.urbandictionary.com/v0/define?term=${query}`)
      .then(res => {
        if (res.data.list.length > 0) {
          const result = { ...res.data.list[0] };
          const resultMsg = `<b>${result.word}</b>\n${
            result.definition
          }\n\n<i>${helper.percentageOfLikes(
            result.thumbs_up,
            result.thumbs_down
          )}% of readers agreed with this definition</i>`;
          bot.sendMessage(msg.chat.id, resultMsg, { parse_mode: "html" });
        } else {
          throw new Error(`Your search returned no results`);
        }
      })
      .catch(err => {
        bot.sendMessage(msg.chat.id, err.message, { parse_mode: "HTML" });
      });
  });
};

module.exports = urbandefine;
