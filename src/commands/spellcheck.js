const axios = require("axios");
const helper = require("../lib/helper");
const config = require("../../tgbotconfig.json");

/**
 * Command: /spell[text]
 * Uses the Microsoft Bing Spellcheck API to proof the text entered by the user
 * and return the same text spell checked
 */

const spellcheck = bot => {
  bot.onText(/^\/spellcheck/, msg => {
    const enctext = encodeURI(
      helper.removeCommandText("/spellcheck", msg.text)
    );
    let text = helper.removeCommandText("/spellcheck", msg.text);
    if (!text) {
      bot.sendMessage(
        msg.chat.id,
        "<b>Please enter some text to spell check.</b>\nExample: /spell Hello wrld",
        { parse_mode: "html" }
      );
      return;
    }
    axios
      .get(
        `https://api.cognitive.microsoft.com/bing/v7.0/spellcheck?mkt=en-US&mode=proof&text=${enctext}&Subscription-Key=${config.azureSpellKey}`
      )
      .then(res => {
        if (res.data.flaggedTokens.length > 0) {
          const corrections = [];
          let predictiveScore = 0;
          res.data.flaggedTokens.forEach(flag => {
            corrections.push({
              token: flag.token,
              suggestion: flag.suggestions[0].suggestion,
              score: flag.suggestions[0].score
            });
          });
          corrections.forEach(correction => {
            text = text.replace(
              correction.token,
              `<b>${correction.suggestion}</b>`
            );
            predictiveScore += correction.score;
          });
          predictiveScore = Math.floor(
            (predictiveScore / corrections.length) * 100
          );
          text += `\n\n<i>Fixed ${corrections.length} ${
            corrections.length > 1 ? "mistakes" : "mistake"
          } with ${predictiveScore}% estimated accuracy</i>`;
          bot.sendMessage(msg.chat.id, text, { parse_mode: "HTML" });
        } else {
          throw new Error(`No spelling mistakes found`);
        }
      })
      .catch(err => {
        bot.sendMessage(msg.chat.id, err.message, { parse_mode: "HTML" });
      });
  });
};

module.exports = spellcheck;
