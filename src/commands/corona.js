const axios = require("axios");
const helper = require("../lib/helper");

/**
 * Command: /corona [country]
 * Get information about the COVID-19 virus in a specified country, or leave blank for worldwide cases.
 */

const corona = bot => {
  bot.onText(/^\/corona/, msg => {
    const country = encodeURI(helper.removeCommandText("/corona", msg.text));
    let endpoint = "";
    let markdown = "";
    if (country) {
      endpoint = "https://corona.lmao.ninja/countries";
    } else {
      endpoint = "https://corona.lmao.ninja/all";
    }
    axios
      .get(`${endpoint}`)
      .then(res => {
        if (country) {
          const countryData = res.data.find(
            data =>
              data.country.toLowerCase() === decodeURI(country.toLowerCase())
          );
          if (countryData) {
            markdown = `[${countryData.country}]
--------------------------------------------------
<b>Cases:</b> ${countryData.cases.toLocaleString()}
<b>New Cases Today:</b> ${countryData.todayCases.toLocaleString()}
<b>Deaths:</b> ${countryData.deaths.toLocaleString()}
<b>Deaths Today:</b> ${countryData.todayDeaths.toLocaleString()}
<b>Critical:</b> ${countryData.critical.toLocaleString()}
<b>Recovered:</b> ${countryData.recovered.toLocaleString()}

<em>The following data has been provided by WorldOMeters.</em>`;

            bot.sendMessage(msg.chat.id, markdown, { parse_mode: "HTML" });
          } else {
            bot.sendMessage(
              msg.chat.id,
              `Couldn't find any data based on your query. 
You can look up your country code here worldometers.info/coronavirus/#countries`,
              {
                parse_mode: "HTML"
              }
            );
          }
        } else {
          markdown = `[Worldwide]
--------------------------------------------------
<b>Cases:</b> ${res.data.cases.toLocaleString()}
<b>Deaths:</b> ${res.data.deaths.toLocaleString()}
<b>Recovered:</b> ${res.data.recovered.toLocaleString()}

<em>The following data has been provided by WorldOMeters.</em>`;

          bot.sendMessage(msg.chat.id, markdown, { parse_mode: "HTML" });
        }
      })
      .catch(err => {
        bot.sendMessage(msg.chat.id, err.message, { parse_mode: "HTML" });
      });
  });
};

module.exports = corona;
