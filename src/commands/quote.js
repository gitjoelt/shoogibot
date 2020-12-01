const axios = require("axios");
const helper = require("../lib/helper");
const config = require("../../tgbotconfig.js");
const ImageCharts = require('image-charts');

/**
 * Command: /quote [ticker]
 * Gets a quote for the ticker entered which can be US and/or CDN stocks
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
      let auxData = "";
      let currency = "CAD";
      const xaxisplots = [];
      const xaxisdays = [];
      const postfix = ticker.match(/[.][a-z]+$/gim)
        ? ticker.match(/[.][a-z]+$/gim)[0]
        : "";
      let responseMsg = "";
      
      // If no price is found, look using the IEX API instead (This is only for US stocks)
      if (!postfix) {
        quoteData = await axios.get(
          `https://cloud.iexapis.com/stable/stock/${ticker}/quote?token=${config.iextoken}`
        );
        auxData = await axios.get(
          `https://cloud.iexapis.com/stable/stock/${ticker}/stats/year1ChangePercent?token=${config.iextoken}`
        );
        currency = "USD";
      } else {
        quoteData = await axios.get(
          `https://tmxapi.herokuapp.com/${ticker}`
        );
        
        /* already found a price, so it must be a non-US stock from the custom API, pull further data from Yahoo Finance 
        but make sure it has a postfix so that the correct data is returned (Yahoo requires a postfix for CDN stocks) */
        auxData = await axios.get(
          `https://query1.finance.yahoo.com/v7/finance/options/${ticker}`
        );
      }

      // gather chart data
      const historicalrsp = await axios.get(`https://tmxapi.herokuapp.com/${ticker}/historical`);
        const chartData = historicalrsp.data;
        chartData.reverse().forEach(datapoint => {
          xaxisplots.push(datapoint.close.toFixed(2));
          xaxisdays.push((new Date(datapoint.date).getMonth() + 1 ) + '/' + (new Date(datapoint.date).getDate()));
        });

      // Pulling name and P/E from the Yahoo API, so need to check if using it
      let longName = "";
      let trailingPE = "";
      if (auxData) {
        if (auxData.data.optionChain) {
          longName = auxData.data.optionChain.result[0].quote.longName;
          trailingPE = auxData.data.optionChain.result[0].quote.trailingPE;
        }
      }

      // Assemble all the data into one object literal
      const rtquote = {
        name: quoteData.data.companyName || longName,
        symbol: quoteData.data.ticker || quoteData.data.symbol,
        price: quoteData.data.price || quoteData.data.latestPrice,
        change: quoteData.data.pointgl || quoteData.data.change.toFixed(2) || 0,
        percent:
          quoteData.data.percentgl || (quoteData.data.changePercent * 100).toFixed(2) || 0,
        year1changepercent: auxData.data * 100 || "",
        week52high: quoteData.data.week52High || "",
        week52low: quoteData.data.week52Low || "",
        peratio: quoteData.data.peRatio || trailingPE,
        currency: currency
      };

      if (rtquote.price) {
        responseMsg = `<b>${rtquote.symbol.replace(postfix, "").toUpperCase()}</b>`;
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
        responseMsg += `${rtquote.price} ${
          rtquote.currency
        } (${rtquote.change}) (${rtquote.percent}%)`;
        if (rtquote.year1changepercent > 0) {
          responseMsg += `\n\n${
            rtquote.name
          } has gone up ${rtquote.year1changepercent.toFixed(
            0
          )}% over the last year.\n<i>During that time it reached a high of ${rtquote.week52high.toFixed(
            2
          )} and bottomed at ${rtquote.week52low.toFixed(2)}</i>`;
        } else if (rtquote.year1changepercent < 0) {
          responseMsg += `\n\n${
            rtquote.name
          } has gone down ${Math.abs(rtquote.year1changepercent.toFixed(
            0
          ))}% over the last year.\n<i>During that time it reached a high of ${rtquote.week52high.toFixed(
            2
          )} and bottomed at ${rtquote.week52low.toFixed(2)}</i>`;
        }
        if (rtquote.peratio > 0) {
          responseMsg += `\n\n${rtquote.name} is currently profitable.\n<i>Investors are currently paying ${Math.floor(rtquote.peratio)}x earnings to own this company</i>`;
        } else if (rtquote.peratio < 0) {
          responseMsg += `\n\n${rtquote.name} is currently <b>not profitable</b> and <b>losing money</b>.\n<i>By holding this stock you could lose your investment if they declare bankruptcy -- not recommended for inexperienced investors</i>`;
        }

        let chart_url;
        //generate chart
        if(xaxisplots.length > 0) {
          chart_url = ImageCharts()
          .cht('lc') // line chart
          .chs('430x250') // 300px x 300px
          .chd(`t:${xaxisplots.join(',')}`)
          .chxt('x,y')
          .chls('3')
          .chtt(`${rtquote.name} (Past Week)`)
          .chg('1,1,1,1')
          .chds('a')
          .chxr(`1,${Math.floor(Math.min(...xaxisplots) - (Math.min(...xaxisplots) * 0.03))},${Math.ceil(Math.max(...xaxisplots) + (Math.max(...xaxisplots) * 0.03))},${Math.floor(rtquote.price / 15)}`)
          .chxl(`0:|${xaxisdays.join('|')}`)
          .chco(`${rtquote.change > 0 ? '48a84f' : 'e1402e'}`) // 48a84f green
          .toURL(); // get the generated URL
        }

        if(chart_url) {
          await bot.sendPhoto(msg.chat.id, chart_url);
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
