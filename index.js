require("dotenv").config();
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { Colors, BetterConsoleLogger } = require('discord.js-v14-helper');
const fs = require('fs');
const config = require('./config/config.js');

const client = new Client(config.client.constructor);

client.commands = new Collection();
client.modules = fs.readdirSync('./commands');

module.exports = client;



fs.readdirSync('./handlers').forEach((handler) => {
    require('./handlers/' + handler)(client, config);
});

// music client
require("./player/main.js")(client);
client.login(config.client.token);


process.on('unhandledRejection', (reason, promise) => {
    console.error('[antiCrash] :: [unhandledRejection]');
    console.log(promise, reason);
});
process.on("uncaughtException", (err, origin) => {
    console.error('[antiCrash] :: [uncaughtException]');
    console.log(err, origin);
});
process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.error('[antiCrash] :: [uncaughtExceptionMonitor]');
    console.log(err, origin);
});


