const { EmbedBuilder } = require('discord.js');
const config = require('../../../config/config.js');
const { youtubeThumbnail } = require('../../../utilities/youtubeThumbnail.js');

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
            .setImage(await youtubeThumbnail(player.queue.current.uri, 'high'))
            .setFooter({ text: `เปิดโดย : ${player.queue.current.requester.username} | Loop : ${loopType} | Volume : ${String(vol)}`})
        return embed;
    }
}