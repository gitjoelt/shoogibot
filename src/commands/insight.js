const axios = require("axios");
const Twitter = require("twitter");
const helper = require("../lib/helper");

/**
 * Command: /insight [topic]
 * Searches tweets based off the topic provided and then returns a positive or negative insight on it using Microsoft's Insight API
 */

const lowtohigh = (a, b) => {
  if (a.score > b.score) {
    return 1;
  }
  if (a.score < b.score) {
    return -1;
  }
  return 0;
};

const insight = bot => {
  bot.onText(/^\/insight/, msg => {
    const topic = encodeURI(helper.removeCommandText("/insight", msg.text));
    if (!topic) {
      bot.sendMessage(
        msg.chat.id,
        "<b>Please enter a topic.</b>\nExample: /insight Donald Trump",
        { parse_mode: "html" }
      );
      return;
    }
    // Connect to twitter and search for replies on the topic
    const client = new Twitter({
      consumer_key: process.env.TWITTERCONSUMERKEY,
      consumer_secret: process.env.TWITTERCONSUMERSECRET,
      access_token_key: process.env.TWITTERACCESSTOKENKEY,
      access_token_secret: process.env.TWITTERACCESSTOKENSECRET
    });
    client.get(
      "search/tweets",
      {
        q: topic,
        lang: "en",
        count: 20,
        result_type: "popular",
        tweet_mode: "extended"
      },
      (error, tweets) => {
        // return if there was an issue
        if (error) {
          bot.sendMessage(msg.chat.id, error, { parse_mode: "HTML" });
          return;
        }
        // if there are tweets available
        if (tweets.statuses.length > 0) {
          const tweetstext = [];
          tweets.statuses.forEach(status => {
            tweetstext.push({
              text: status.full_text,
              id: status.id,
              language: status.lang
            });
          });
          // create an array of the tweets to convert to JSON for the sentiment API
          let sendData = { documents: tweetstext };
          sendData = JSON.stringify(sendData);
          const axiosOptions = {
            method: "POST",
            url:
              "https://eastus.api.cognitive.microsoft.com/text/analytics/v2.1/sentiment",
            data: sendData,
            headers: {
              "Ocp-Apim-Subscription-Key": process.env.AZURETEXTRECKEY,
              "Content-Type": "application/json"
            }
          };
          // send the packaged data to the API
          axios(axiosOptions)
            .then(res => {
              const sentiments = res.data.documents;
              // if there are sentiments available to read
              if (sentiments.length > 0) {
                let avgSentiment = 0;
                // sort the sentiments from highest score to lowest so that first index is highest sentiment and last index is lowest
                sentiments.sort(lowtohigh);
                sentiments.forEach(sentiment => {
                  avgSentiment += sentiment.score;
                });
                avgSentiment = (avgSentiment / sentiments.length) * 100;
                const lastSentiment = sentiments[sentiments.length - 1];
                const lowestComment = tweetstext.find(ele => {
                  return ele.id == sentiments[0].id;
                });
                const highestComment = tweetstext.find(ele => {
                  return ele.id == lastSentiment.id;
                });
                const responseMsg = `<b>${decodeURI(
                  topic.toUpperCase()
                )}</b>\n\n[Sentiment Score]\n--------------------------------------------------\n<b>Lowest:</b> ${Math.floor(
                  sentiments[0].score * 100
                )}%\n<b>Highest:</b> ${Math.floor(
                  lastSentiment.score * 100
                )}%\n<b>Average:</b> ${Math.floor(
                  avgSentiment
                )}%\n\n[Discussion]\n--------------------------------------------------\n<b>Most Negative:</b>\n${
                  lowestComment.text
                }\n\n<b>Most Positive:</b>\n${highestComment.text}`;
                bot.sendMessage(msg.chat.id, responseMsg, {
                  parse_mode: "HTML"
                });
              } else {
                bot.sendMessage(
                  msg.chat.id,
                  `Unable to find sentiment on that topic`,
                  { parse_mode: "HTML" }
                );
              }
            })
            .catch(err => {
              bot.sendMessage(msg.chat.id, `Axios: ${err.message}`, {
                parse_mode: "HTML"
              });
            });
        } else {
          bot.sendMessage(
            msg.chat.id,
            `Couldn't find any relevant information about that topic to provide insight on`,
            {
              parse_mode: "HTML"
            }
          );
        }
      }
    );
  });
};

module.exports = insight;
