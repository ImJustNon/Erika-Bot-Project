const { executeQuery } = require("../../../database/mysql_connection.js");

module.exports = client => {
    client.on("messageCreate", async(message) =>{
        if(message.author.bot || message.author.username === client.user.username) return;

        // first check if channel name have follow keyword
        const textChannel = message.channel;
        if(!textChannel.name.includes("music") && !textChannel.name.includes(`${client.user.username}-music`) && !textChannel.name.includes(`${client.user.username}`)) return;

        const getMusicChannelData = await executeQuery('SELECT * FROM guild_music_channel WHERE guild_id=? AND channel_id=?', [String(message.guild.id), String(message.channel.id)]);
        if(getMusicChannelData.results.length === 0) return;


        message.reply("This is music channel");
    });
}