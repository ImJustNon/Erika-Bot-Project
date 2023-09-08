const { EmbedBuilder } = require('discord.js');
const config = require('../../../config/config.js');

module.exports = {
    defaultCurrentTrackEmbed: async(client, player) =>{
        const embed = new EmbedBuilder()
			.setColor(config.features.musicChannel.defaultEmbedColor)
			.setTitle('ยังไม่มีเพลงเล่นอยู่ ณ ตอนนี้')
			.setImage(config.features.musicChannel.defaultTrackImageUrl)
			.setFooter({ text: `ใช้ /help สำหรับคำสั่งเพิ่มเติม` })
			.setTimestamp()
        return embed;
    }
}