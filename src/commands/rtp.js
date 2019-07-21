const axios = require("axios");
const helper = require("../lib/helper");

/**
 * Command: /rtp [subreddit]
 * Gets the top (not sticked) post from the specified subreddit
 */

const rtp = bot => {
  bot.onText(/^\/rtp/, msg => {
    const subreddit = encodeURI(helper.removeCommandText("/rtp", msg.text));
    if (!subreddit) {
      bot.sendMessage(
        msg.chat.id,
        "<b>Please enter a subreddit</b>\nExample: /rtp backgrounds",
        { parse_mode: "html" }
      );
      return;
    }
    axios
      .get(`https://reddit.com/r/${subreddit}.json`)
      .then(res => {
        if (res.data.data.children.length > 0) {
          const toppost = res.data.data.children.find(
            posts => !posts.data.stickied
          );

          // is it an image?
          if (toppost.data.url.match(/(.jpg|.gif|.png)$/gi)) {
            bot.sendPhoto(msg.chat.id, toppost.data.url).catch(error => {
              bot.sendMessage(
                msg.chat.id,
                `Whoops, something went wrong with Telegram\n${error}`
              );
            });
          } else {
            bot.sendMessage(msg.chat.id, toppost.data.url);
          }
        } else {
          throw new Error(
            `Either the subreddit is locked down or it doesn't exist`
          );
        }
      })
      .catch(err => {
        bot.sendMessage(msg.chat.id, err.message, { parse_mode: "HTML" });
      });
  });
};

module.exports = rtp;
