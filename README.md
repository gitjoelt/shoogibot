# Telegram Bot

This is the start of a project moving the Telegram Bot [@shoogi_bot](https://telegram.me/shoogi_bot) from PHP 5.3 + MySQL to NodeJS + MongoDB. The app is designed to run on Heroku but it can also be run on any server with the requirements below.

### Requirements

Node >= 12.6.0

NPM >= 6.9.0

MongoDB >= 3.6.9

Telegram Messenger

A Telegram Bot API Token (See [@botfather](https://telegram.me/botfather) on Telegram Messenger to get one)

### Installing

To download the dependencies type

```
npm install
```

### Config

Navigate to the _tgbotconfig.js_ file in the root of the project. If you are not running this project on heroku you will need to include all the requested information in this area

```
// Fill this out if you aren't running on Heroku
  config = {
    token: "",
    youTubeKey: "",
    azureSpellKey: "",
    azureSearchKey: "",
    mongoConnection: ""
  };
```

### Heroku Config

If you are running this app on heroku please add the following environment variables with their respective values

```
APPURL=Your App URL
AZURESEARCHKEY=Your Key Here
AZURESPELLKEY=Your Key Here
MONGODB_URI=Your Connection String Here
TOKEN=Your Token Here
YOUTUBEKEY=Your Key Here
```

If you are planning on running this project locally through the _heroku local_ command you will need to add an .env file to the root of the project with these environment variables below

```
AZURESEARCHKEY=Your Key Here
AZURESPELLKEY=Your Key Here
MONGODB_URI=Your Connection String Here
TOKEN=Your Token Here
YOUTUBEKEY=Your Key Here
```

### Run

To run the project locally type

```
npm start
```

OR

```
node index.js
```

Navigate to the bot you created through BotFather on Telegram Messenger and type /start or /help to see the project in action
