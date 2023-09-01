const { executeQuery } = require("../../database/mysql_connection.js");
const { manager } = require("../../player/manager.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'volume',
    description: 'ปรับระดับความดังเสียง',
    type: 1,
    options: [
        {
            name: 'volume',
            description: '0 - 100',
            type: 3,
            required: true,
        },
    ],
    role_perms: null,
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

        let new_volume = interaction.options.get("volume").value;
        if(isNaN(new_volume)) return interaction.reply(`⚠ | โปรดระบุระดับความดังเป็นตัวเลขเท่านั้นน่ะ`);
        if(parseInt(new_volume) > 100) return interaction.reply(`⚠ | ไม่สามารถเพิ่มเสียงมากกว่า \`100\` ได้น่ะ`);
        if(parseInt(new_volume) < 0) return interaction.reply('⚠ | ไม่สามารถลดเสียงน้อยกว่า \`0\` ได้น่ะ');
        
        player.setVolume(parseInt(new_volume));
        interaction.reply(`✅ | ตั้งค่าความดังเสียงเป็น \`${new_volume}\` เรียบร้อยเเล้ว`);
    }
};