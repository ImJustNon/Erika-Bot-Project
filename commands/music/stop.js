const { executeQuery } = require("../../database/mysql_connection.js");
const { manager } = require("../../player/manager.js");
const { EmbedBuilder, Embed } = require("discord.js");

module.exports = {
    name: 'stop',
    description: 'หยุดเล่นเพลงใน VoiceChannel',
    type: 1,
    options: [],
    userPermissions: [],
    developers_only: false,
    category: 'music',
    callback: async ({client, interaction, config}) => {
        const guild = client.guilds.cache.get(interaction.guild.id);
        const member = guild.members.cache.get(interaction.member.user.id);
        const channel = member.voice.channel;

        const me = guild.members.cache.get(client.user.id);

        let player = manager.players.get(interaction.guild.id);

        if(!channel) return interaction.reply('⚠ | โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ');
        if(me.voice.channel && !channel.equals(me.voice.channel)) return interaction.reply('⚠ | ดูเหมือนว่าคุณจะไม่ได้อยู่ช่องเสียงเดียวกันน่ะ');
        if(!player || !player.queue.current) return interaction.reply('⚠ | ยังไม่มีการเล่นเพลง ณ ตอนนี้เลยน่ะ');

        player.destroy();
        interaction.reply(`✅ | ทำการปิดเพลงเรียบร้อยเเล้ว`);
    }
};