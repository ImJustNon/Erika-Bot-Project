const client = require('../index.js');
const { ActivityType } = require("discord.js");


client.on('ready', async () => {
    console.log(`> Logged in as : ${client.user.username} #${client.user.discriminator}`);
    
    change_status();
    setInterval(() => {
        change_status(client);
    }, 10 * 1000);

    require("../app/app.js");
});

async function change_status() {
    try{
        client.user.setActivity({
            activities: [{
                name: `/help | ${client.guilds.cache.size} เซิฟเวอร์`, 
                type: ActivityType.Streaming,
                url: "https://www.twitch.tv/im_just_non",
            }],
            status: 'online',
        });
    }
	catch(e){
        client.user.setPresence({
            activities: [{
                name: `/help | ${client.guilds.cache.size} เซิฟเวอร์`, 
                type: ActivityType.Streaming,
                url: "https://www.twitch.tv/im_just_non",
            }],
            status: 'online',
        });
    }
}