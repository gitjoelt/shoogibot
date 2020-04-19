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
      endpoint = "https://corona.lmao.ninja/v2/countries";
    } else {
      endpoint = "https://corona.lmao.ninja/v2/all";
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
            const tdate = new Date(countryData.updated);
            markdown = `[${countryData.country}]
--------------------------------------------------
<b>Tests Performed:</b> ${countryData.tests.toLocaleString()}
<b>Cases:</b> ${countryData.cases.toLocaleString()}
<b>New Cases Today:</b> ${countryData.todayCases.toLocaleString()}
<b>Deaths:</b> ${countryData.deaths.toLocaleString()}
<b>Deaths Today:</b> ${countryData.todayDeaths.toLocaleString()}
<b>Critical:</b> ${countryData.critical.toLocaleString()}
<b>Recovered:</b> ${countryData.recovered.toLocaleString()}

Of those tested:
-><strong> ${Math.floor(
              (countryData.cases / countryData.tests) * 100
            )}%</strong> tested positive for corona virus

Of those who tested positive:
-><strong> ${((countryData.deaths / countryData.cases) * 100).toFixed(
              2
            )}%</strong> died from corona virus
-><strong> ${((countryData.recovered / countryData.cases) * 100).toFixed(
              2
            )}%</strong> recovered from corona virus

<em>The following data has been provided by WorldOMeters and was last updated on ${tdate.toString()}.</em>`;

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
<b>Tests Performed:</b> ${res.data.tests.toLocaleString()}
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
