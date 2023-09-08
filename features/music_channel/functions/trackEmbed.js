const { EmbedBuilder } = require('discord.js');
const config = require('../../../config/config.js');
const { youtubeThumbnail } = require('../../../utilities/youtubeThumbnail.js');
const { convertTime } = require("../../../utilities/convertTime.js");

module.exports = {
    trackEmbed: async(client, player) =>{
        let loopType = 'ปิด';
        if(player.loop === "track") loopType = 'เพลงเดียว';
        else if(player.loop === "queue") loopType = 'ทั้งหมด'; 

        let vol = await player.volume;
        if(player.volume <= 0) vol = 'ปิดเสียง';

        const embed = new EmbedBuilder()
            .setColor(config.features.musicChannel.defaultEmbedColor)
            .setTitle(player.queue.current.title)
            .setURL(player.queue.current.uri)
            .addFields([
                {
                    name: "📫 | เปิดโดย",
                    value: `<@${player.queue.current.requester}>`,
                    inline: true,
                },
                {
                    name: "🔄 | Loop",
                    value: `\` ${loopType} \``,
                    inline: true,
                },
                {
                    name: "🔊 | Volume",
                    value: `\` ${String(parseInt(vol * 100))} \``,
                    inline: true,
                },
                {
                    name: "🚪 | ช่อง",
                    value: `<#${player.textId}>`,
                    inline: true,
                },
                {
                    name: "🌍 | Creator",
                    value: `\` ${player.queue.current.author} \``,
                    inline: true,
                },
                {
                    name: "⏳ | เวลา",
                    value: `\` ${await convertTime(player.queue.current.length)} \``,
                    inline: true,
                },
            ])
            .setImage(await youtubeThumbnail(player.queue.current.uri, 'high'))
            .setFooter({ text: client.user.username})
            .setTimestamp();
        return embed;
    }
}