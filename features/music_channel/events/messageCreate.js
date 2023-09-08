const { executeQuery } = require("../../../database/mysql_connection.js");

module.exports = client => {
    client.on("messageCreate", async(message) =>{
        if(message.author.bot || message.author.username === client.user.username) return;

        // first check if channel name have follow keyword
        const textChannel = message.channel;
        if(!textChannel.name.includes("music") && !textChannel.name.includes(`${client.user.username}-music`) && !textChannel.name.includes(`${client.user.username}`)) return;

        // then check bt use database
        const getMusicChannelData = await executeQuery('SELECT * FROM guild_music_channel WHERE guild_id=? AND channel_id=?', [String(message.guild.id), String(message.channel.id)]);
        if(getMusicChannelData.results.length === 0) return;


        const msgContent = message.content;
        setTimeout(async() =>{
            await message.delete();
        }, 1000);
        console.log(msgContent);
    });
}