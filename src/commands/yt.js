const axios = require("axios");
const helper = require("../lib/helper");
const config = require("../../tgbotconfig");

/**
 * Command: /yt [search Query]
 * Looks up the top search result on Youtube.com using the Youtube API
 */

const yt = bot => {
  bot.onText(/^\/yt/, msg => {
    const query = encodeURI(helper.removeCommandText("/yt", msg.text));
    if (!query) {
      bot.sendMessage(
        msg.chat.id,
        "<b>Please enter a search query.</b>\nExample: /yt Ariana Grande thinking about you",
        { parse_mode: "html" }
      );
      return;
    }
    axios
      .get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&maxResults=3&key=${config.youTubeKey}`
      )
      .then(res => {
        const videos = res.data.items.filter(item => item.id.videoId);
        if (videos.length > 0) {
          const { videoId } = videos[0].id;
          bot.sendMessage(
            msg.chat.id,
            `https://www.youtube.com/watch?v=${videoId}`
          );
        } else {
          throw new Error(`Your search returned no results`);
        }
      })
      .catch(err => {
        bot.sendMessage(msg.chat.id, err.message, { parse_mode: "HTML" });
      });
  });
};

module.exports = yt;
