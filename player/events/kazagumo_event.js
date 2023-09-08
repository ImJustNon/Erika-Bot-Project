
const { manager } = require("../manager.js");
const { EmbedBuilder } = require("discord.js");
const { convertTime } = require("../utils/convertTime.js");
const config = require("../../config/config.js");
const { sqliteExecute } = require("../../database/sqlite.js");
const { queueMessage } = require("../../features/music_channel/functions/queueMessage.js");
const { trackEmbed } = require("../../features/music_channel/functions/trackEmbed.js");
const { defaultCurrentTrackEmbed } = require("../../features/music_channel/functions/defaultCurrentTrackEmbed.js");

module.exports = async(client) =>{
    manager.on("playerStart", async(player, track) => {
        const channel = await client.channels.cache.get(player.textId);
        const voice = await client.channels.cache.get(player.voiceId); 

        const getMusicChannelData = await sqliteExecute.get('SELECT * FROM guild_music_channel_cache WHERE guild_id=? AND channel_id=?', [String(player.guildId), String(player.textId)]);
        if(getMusicChannelData.results.length !== 0){
            const bannerContent = await channel.messages.fetch(getMusicChannelData.results[0].content_banner_id);
            const queueContent = await channel.messages.fetch(getMusicChannelData.results[0].content_queue_id);
            const trackContent = await channel.messages.fetch(getMusicChannelData.results[0].content_current_id);

            await queueContent.edit({ content: await queueMessage(client, player) });
            await trackContent.edit({ embeds: [ await trackEmbed(client, player) ] });
        }
        else {
            await channel.send({
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
        }
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
        const channel = await client.channels.cache.get(player.textId);
        const getMusicChannelData = await sqliteExecute.get('SELECT id FROM guild_music_channel_cache WHERE guild_id=? AND channel_id=?', [String(player.guildId), String(player.textId)]);
        
        const msg = await channel.send({ embeds: [ new EmbedBuilder().setColor("Random").setTitle('💤 | คิวหมดเเล้วน่ะ') ] });
        if(getMusicChannelData.results.length !== 0){
            setTimeout(async() => {
                await msg.delete();
            }, 5000);
        }
        player.destroy();
    });
    
    manager.on("playerDestroy", async(player) =>{
        const channel = await client.channels.cache.get(player.textId);
        const getMusicChannelData = await sqliteExecute.get('SELECT * FROM guild_music_channel_cache WHERE guild_id=? AND channel_id=?', [String(player.guildId), String(player.textId)]);

        if(getMusicChannelData.results.length !== 0){
            const bannerContent = await channel.messages.fetch(getMusicChannelData.results[0].content_banner_id);
            const queueContent = await channel.messages.fetch(getMusicChannelData.results[0].content_queue_id);
            const trackContent = await channel.messages.fetch(getMusicChannelData.results[0].content_current_id);

            await queueContent.edit({ content: '**คิวเพลง:**\nเข้าช่องเสียง และพิมพ์ชื่อเพลงหรือลิงก์ของเพลง เพื่อเปิดเพลงน่ะ' });
            await trackContent.edit({ embeds: [ await defaultCurrentTrackEmbed(client, player) ] });
        }
    });

} 