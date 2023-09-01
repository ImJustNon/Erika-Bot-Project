const { executeQuery } = require("../../database/mysql_connection.js");
const { manager } = require("../../player/manager.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'connect',
    description: 'เข้า Voice Channel',
    type: 1,
    options: [],
    role_perms: null,
    developers_only: false,
    category: 'music',
    callback: async ({client, interaction, config}) => {
        const guild = client.guilds.cache.get(interaction.guildId)
        const member = guild.members.cache.get(interaction.member.user.id);
        const channel = member.voice.channel;

        const me = guild.members.cache.get(client.user.id);

        let player = manager.players.get(interaction.guild.id);

        if(!channel) return interaction.reply('⚠ | โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ');
        if(player) return interaction.reply('⚠ | ตอนนี้กำลังเชื่อมต่อช่องอื่นอยู่น่ะ');

        player = await manager.createPlayer({
            guildId: interaction.guild.id,
            textId: interaction.channel.id,
            voiceId: member.voice.channel.id,
            volume: 80,
        });
        interaction.reply(`✅ | เข้าช่อง ${channel.name} มาเเล้วน่ะ`);
    }
};