let config = null;

if (process.env.TOKEN === undefined) {
  // Fill this out if you aren't running on Heroku
  config = {
    token: "",
    youTubeKey: "",
    azureSpellKey: "",
    azureSearchKey: "",
    azureTextRecKey: "",
    twitterAccessTokenKey: "",
    twitterAccessTokenSecret: "",
    twitterConsumerKey: "",
    twitterConsumerSecret: "",
    mongoConnection: ""
  };
} else {
  config = {
    token: process.env.TOKEN,
    youTubeKey: process.env.YOUTUBEKEY,
    azureSpellKey: process.env.AZURESPELLKEY,
    azureSearchKey: process.env.AZURESEARCHKEY,
    azureTextRecKey: process.env.AZURETEXTRECKEY,
    twitterAccessTokenKey: process.env.TWITTERACCESSTOKENKEY,
    twitterAccessTokenSecret: process.env.TWITTERACCESSTOKENSECRET,
    twitterConsumerKey: process.env.TWITTERCONSUMERKEY,
    twitterConsumerSecret: process.env.TWITTERCONSUMERSECRET,
    mongoConnection: process.env.MONGODB_URI
  };
}

module.exports = config;
