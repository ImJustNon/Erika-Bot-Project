const client = require('../index.js');
const { ActivityType } = require("discord.js");


client.on('debug', async (info) => {
    console.log(`[Debug] ${info}`)
});
