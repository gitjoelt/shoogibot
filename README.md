# Telegram Bot

This is the start of a project moving the Telegram Bot [@shoogi_bot](https://telegram.me/shoogi_bot) from PHP 5.3 + MySQL to NodeJS + MongoDB

### Requirements

Node >= 12.6.0

NPM >= 6.9.0

Telegram Messenger

A Telegram Bot API Token (See [@botfather](https://telegram.me/botfather) on Telegram Messenger to get one)

### Installing

To download the dependencies type

```
npm install
```

### Config

In the root of the project you will need to create a file called _tgbotconfig.json_
It should look like this

```
{
  "token": "Your Telegram Bot API Token",
  "youTubeKey": "Your Youtube API Key"
}
```

### Run

To run the project type

```
node index.js
```

Navigate to the bot you created through BotFather on Telegram Messenger and type /start or /help to see the project in action
