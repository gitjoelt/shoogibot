const axios = require("axios");
const helper = require("../lib/helper");

/**
 * Command: /rr [subreddit]
 * Gets a random (not sticked) post from the specified subreddit
 */

const rr = bot => {
  bot.onText(/^\/rr/, msg => {
    const subreddit = encodeURI(helper.removeCommandText("/rr", msg.text));
    if (!subreddit) {
      bot.sendMessage(
        msg.chat.id,
        "<b>Please enter a subreddit</b>\nExample: /rr science",
        { parse_mode: "html" }
      );
      return;
    }
    axios
      .get(`https://reddit.com/r/${subreddit}.json`)
      .then(res => {
        if (res.data.data.children.length > 0) {
          const allPosts = res.data.data.children.filter(
            posts => !posts.data.stickied
          );
          const randomIndex = Math.floor(
            Math.random() * Math.floor(allPosts.length)
          );

          // is it an image?
          if (allPosts[randomIndex].data.url.match(/(.jpg|.gif|.png)$/gi)) {
            bot
              .sendPhoto(msg.chat.id, allPosts[randomIndex].data.url)
              .catch(error => {
                bot.sendMessage(
                  msg.chat.id,
                  `Whoops, something went wrong with Telegram\n${error}`
                );
              });
          } else {
            bot.sendMessage(msg.chat.id, allPosts[randomIndex].data.url);
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

module.exports = rr;
