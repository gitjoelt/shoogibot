let config = null;

if (process.env.TOKEN === undefined) {
  // Fill this out if you aren't running on Heroku
  config = {
    token: "",
    youTubeKey: "",
    azureSpellKey: "",
    azureSearchKey: "",
    mongoConnection: ""
  };
} else {
  config = {
    token: process.env.TOKEN,
    youTubeKey: process.env.YOUTUBEKEY,
    azureSpellKey: process.env.AZURESPELLKEY,
    azureSearchKey: process.env.AZURESEARCHKEY,
    mongoConnection: process.env.MONGODB_URI
  };
}

module.exports = config;
