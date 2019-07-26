const axios = require("axios");
const helper = require("../lib/helper");
const config = require("../../tgbotconfig.js");

/**
 * Command: /quote [ticker]
 * Gets a quote for the ticker entered
 */

const quote = bot => {
  bot.onText(/^\/quote/, async msg => {
    const ticker = encodeURI(helper.removeCommandText("/quote", msg.text));
    if (!ticker) {
      bot.sendMessage(
        msg.chat.id,
        "<b>Please enter a ticker</b>\nExample: /quote AMD",
        { parse_mode: "html" }
      );
      return;
    }
    try {
      let quoteData = "";
      let responseMsg = "";
      quoteData = await axios.get(
        `https://shoogibot.xyz/bot/tmxcustomapi.php?ticker=${ticker}`
      );
      if (!quoteData.data.price) {
        quoteData = await axios.get(
          `https://cloud.iexapis.com/stable/stock/${ticker}/quote?token=${config.iextoken}`
        );
      }

      const rtquote = {
        name: quoteData.data.companyName || "",
        symbol: quoteData.data.ticker || quoteData.data.symbol,
        price: quoteData.data.price || quoteData.data.latestPrice,
        change: quoteData.data.pointgl || quoteData.data.change || 0,
        percent:
          quoteData.data.percentgl || quoteData.data.changePercent * 100 || 0,
        ytdchange: quoteData.data.ytdChange * 100 || "",
        week52high: quoteData.data.week52High || "",
        week52low: quoteData.data.week52Low || "",
        peratio: quoteData.data.peRatio || ""
      };

      if (rtquote.price) {
        responseMsg = `<b>${rtquote.symbol.toUpperCase()}</b>`;
        if (rtquote.name) {
          responseMsg += ` ${rtquote.name}\n`;
        } else {
          responseMsg += `\n`;
        }
        if (rtquote.change > 0) {
          responseMsg += `▲$`;
        } else if (rtquote.change < 0) {
          responseMsg += `▼$`;
        } else {
          responseMsg += `$`;
        }
        responseMsg += `${rtquote.price} (${rtquote.change.toFixed(
          2
        )}) (${rtquote.percent.toFixed(2)}%)`;
        if (rtquote.ytdchange > 0) {
          responseMsg += `\n\n${
            rtquote.symbol
          } has gone up ${rtquote.ytdchange.toFixed(
            2
          )}% since the start of the year.\n<i>During that time it reached an intraday high of ${rtquote.week52high.toFixed(
            2
          )} and bottomed at ${rtquote.week52low.toFixed(2)}</i>`;
        } else if (rtquote.ytdchange < 0) {
          responseMsg += `\n\n${
            rtquote.symbol
          } has gone down ${rtquote.ytdchange.toFixed(
            2
          )}% since the start of the year.\n<i>During that time it reached an intraday high of ${rtquote.week52high.toFixed(
            2
          )} and bottomed at ${rtquote.week52low.toFixed(2)}</i>`;
        }
        if (rtquote.peratio > 0) {
          responseMsg += `\n\n${
            rtquote.symbol
          } is currently profitable.\n<i>For every ~$${rtquote.peratio.toFixed(
            2
          )} you spend on this stock, you are entitled to one dollar of the companies earnings</i>`;
        } else if (rtquote.peratio < 0) {
          responseMsg += `\n\n${rtquote.symbol} is currently <b>not profitable</b> and <b>losing money</b>.\n<i>There are no profits available to pass on to you and by holding this stock you could lose your principal investment if they declare bankruptcy -- Not recommended for inexperienced investors</i>`;
        }
      }
      bot.sendMessage(msg.chat.id, responseMsg, {
        parse_mode: "html"
      });
    } catch (e) {
      bot.sendMessage(
        msg.chat.id,
        `<b>Sorry, something went wrong when trying to fetch the latest quote. See below for more details.</b>\n${e}`,
        {
          parse_mode: "html"
        }
      );
    }
  });
};

module.exports = quote;
