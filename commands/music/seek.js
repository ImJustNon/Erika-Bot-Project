const { executeQuery } = require("../../database/mysql_connection.js");
const { manager } = require("../../player/manager.js");
const { EmbedBuilder } = require("discord.js");
const { convertTime } = require("../../player/utils/convertTime.js");

module.exports = {
    name: 'seek',
    description: 'ใช้สำหรับข้ามไปตรงนาทีที่อยากฟัง',
    type: 1,
    options: [
        {
            name: 'duration',
            description: 'ช่วงนาทีที่ต้องการข้ามไป เช่น 02:29',
            type: 3,
            required: true,
        },
    ],
    userPermissions: [],
    developers_only: false,
    category: 'music',
    callback: async ({client, interaction, config}) => {
        const durationPattern = /^[0-5]?[0-9](:[0-5][0-9]){1,2}$/;
        const duration = interaction.options.get('duration').value;
            
        const guild = client.guilds.cache.get(interaction.guildId)
        const member = guild.members.cache.get(interaction.member.user.id);
        const channel = member.voice.channel;

        const me = guild.members.cache.get(client.user.id);

        let player = manager.players.get(interaction.guildId);

        if(!channel) return interaction.reply('⚠ | โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ');
        if(me.voice.channel && !channel.equals(me.voice.channel)) return interaction.reply('⚠ | ดูเหมือนว่าคุณจะไม่ได้อยู่ช่องเสียงเดียวกันน่ะ');
        if(!player || !player.queue.current) return interaction.reply('⚠ | ยังไม่มีการเล่นเพลง ณ ตอนนี้เลยน่ะ');

        if(!player.queue.current.isSeekable) return interaction.reply('⚠ | เพลงนี้ไม่สามารถข้ามได้น่ะ');
        if(!durationPattern.test(duration)) return interaction.reply('⚠ | โปรดระบุรูปเเบบเวลาให้ถูกต้องด้วยน่ะ');
        const durationMs = durationToMillis(duration);
        if(durationMs > player.queue.current.length) return interaction.reply('⚠ | เวลาที่คุณระบุมาไม่ตรงกับความยาวของเพลงน่ะ');

        player.seek(durationMs)
		interaction.reply(`✅ | ทำการข้ามไปที่ ${convertTime(durationMs)} เรียบร้อยเเล้ว`);
    }
};

function durationToMillis(dur){
	return dur.split(":").map(Number).reduce((acc, curr) => curr + acc * 60) * 1000;
}