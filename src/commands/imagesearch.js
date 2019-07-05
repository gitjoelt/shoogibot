const axios = require("axios");
const helper = require("../lib/helper");
const config = require("../../tgbotconfig.json");

/**
 * Command: /imagesearch [query]
 * Uses the Microsoft Bing Image Search API to get a collection of the most relevant images
 * based on the users query.
 */

const imagesearch = bot => {
  bot.onText(/^\/imagesearch/, msg => {
    const query = encodeURI(helper.removeCommandText("/imagesearch", msg.text));
    if (!query) {
      bot.sendMessage(
        msg.chat.id,
        "<b>Please enter a search query.</b>\nExample: /imagesearch Toronto",
        { parse_mode: "html" }
      );
      return;
    }
    axios
      .get(
        `https://api.cognitive.microsoft.com/bing/v7.0/images/search?q=${query}&safeSearch=Off&Subscription-Key=${config.azureSearchKey}`
      )
      .then(res => {
        if (res.data.value.length > 0) {
          const images = res.data.value.slice(0, 5);
          const imageGroup = [];
          images.forEach(image => {
            imageGroup.push({ type: "photo", media: image.contentUrl });
          });
          bot.sendMediaGroup(msg.chat.id, imageGroup);
        } else {
          throw new Error(`No images found`);
        }
      })
      .catch(err => {
        bot.sendMessage(msg.chat.id, err.message, { parse_mode: "HTML" });
      });
  });
};

module.exports = imagesearch;
