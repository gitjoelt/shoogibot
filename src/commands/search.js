const axios = require("axios");
const helper = require("../lib/helper");
const config = require("../../tgbotconfig");

/**
 * Command: /search [query]
 * Uses the Microsoft Bing Search API to get the top search result
 * based on the users query.
 */

const search = bot => {
  bot.onText(/^\/search/, msg => {
    const query = encodeURI(helper.removeCommandText("/search", msg.text));
    if (!query) {
      bot.sendMessage(
        msg.chat.id,
        "<b>Please enter a search query.</b>\nExample: /search Toronto",
        { parse_mode: "html" }
      );
      return;
    }
    axios
      .get(
        `https://api.cognitive.microsoft.com/bing/v7.0/search?q=${query}&safeSearch=Off&Subscription-Key=${config.azureSearchKey}`
      )
      .then(res => {
        if (res.data.webPages.value.length > 0) {
          const result = res.data.webPages.value[0];
          const crawlDate = new Date(
            Date.parse(result.dateLastCrawled)
          ).toDateString();
          let crawlMessage = "";
          if (crawlDate !== "Invalid Date") {
            crawlMessage = `✓ Checked on ${crawlDate}`;
          }
          const msgResponse = `${result.url}
➥ This link is${result.isFamilyFriendly ? "" : " <b>NOT</b>"} safe for work
${crawlMessage}\n
<i>Top result of ${res.data.webPages.totalEstimatedMatches} total matches</i>`;

          bot.sendMessage(msg.chat.id, msgResponse, { parse_mode: "HTML" });
        } else {
          throw new Error(`No results found`);
        }
      })
      .catch(err => {
        bot.sendMessage(msg.chat.id, err.message, { parse_mode: "HTML" });
      });
  });
};

module.exports = search;
