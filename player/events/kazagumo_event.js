
const { manager } = require("../manager.js");
const { EmbedBuilder } = require("discord.js");
const { convertTime } = require("../utils/convertTime.js");

module.exports = async(client) =>{
    manager.on("playerStart", async(player, track) => {
        const channel = client.channels.cache.get(player.textId);
        const voice = client.channels.cache.get(player.voiceId); 

        channel.send({
            embeds: [
                new EmbedBuilder()
                .setColor("Random")
                .setThumbnail(track.thumbnail)
                .addFields(
                    [
                        {
                            name: `🎵 | กำลังเล่นเพลง`,
                            value: `[${track.title}](${track.uri})`, 
                            inline: false,
                        },
                        {
                            name: `🏡 | ในห้อง`,
                            value: `<#${voice.id}>`, 
                            inline: true,
                        },
                        {
                            name: `⏲️ | ความยาว`,
                            value: `\`${await convertTime(track.length)}\``, 
                            inline: true,
                        },
                        {
                            name: `📥 | ขอเพลงโดย`,
                            value: `<@${track.requester}>`, 
                            inline: true,
                        },
                    ],
                )
                .setFooter({text: client.user.username})
                .setTimestamp()
            ],
        });
        // client.channels.cache.get(player.textId)?.send({content: `Now playing **${track.title}** by **${track.author}**`}).then(x => player.data.set("message", x));
    });
    
    manager.on("playerEnd", async(player) => {
        // const channel = client.channels.cache.get(player.textId);
        // const musicChannelID = await db.get(`music_${client.user.id}_${player.guild}_channel`);
        
        
        // const msg = await channel.send('❗ | คิวหมดเเล้วน่ะ');
        // if(player.textChannel == musicChannelID){
        //     setTimeout(() => {
        //         msg.delete();
        //     }, 5000);
        // }
        // player.destroy();
        // player.data.get("message")?.edit({content: `Finished playing`});
    });
    
    manager.on("playerEmpty", async(player) => {
        const channel = client.channels.cache.get(player.textId);
        // const musicChannelID = await db.get(`music_${client.user.id}_${player.guild}_channel`);
        
        
        const msg = await channel.send('❗ | คิวหมดเเล้วน่ะ');
        // if(player.textChannel == musicChannelID){
        //     setTimeout(() => {
        //         msg.delete();
        //     }, 5000);
        // }
        player.destroy();

        // client.channels.cache.get(player.textId)?.send({content: `Destroyed player due to inactivity.`}).then(x => player.data.set("message", x));
        // player.destroy();
    });
    
    manager.on("playerDestroy", (player) =>{
        
    });

} 