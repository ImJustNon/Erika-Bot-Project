const { executeQuery } = require("../../database/mysql_connection.js");
const { manager } = require("../../player/manager.js");
const { EmbedBuilder } = require("discord.js");
const { convertTime } = require("../../player/utils/convertTime.js");

module.exports = {
    name: 'queue',
    description: 'รายการคิวเพลง',
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

        let player = manager.players.get(interaction.guildId);

        if(!channel) return interaction.reply('⚠ | โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ');
        if(me.voice.channel && !channel.equals(me.voice.channel)) return interaction.reply('⚠ | ดูเหมือนว่าคุณจะไม่ได้อยู่ช่องเสียงเดียวกันน่ะ');
        if(!player || !player.queue.current) return interaction.reply('⚠ | ยังไม่มีการเล่นเพลง ณ ตอนนี้เลยน่ะ');
        if(!player.queue.size || player.queue.size === 0 || !player.queue || player.queue.length === 0) return interaction.reply('⚠ | คุณยังไม่มีคิวการเล่นน่ะ');

        let queueMsg = "";
        let qlnwza;
        let mem;
        for(let i = 0; i < player.queue.length; i++){
            mem = guild.members.cache.get(player.queue[i].requester)
            queueMsg += `\`${i + 1})\` [${await convertTime(player.queue[i].length)}] - ${player.queue[i].title}\n╰  **เพิ่มโดย** : \`${member.user.username}\`\n`;
            if(queueMsg.length > 4096) break;
            qlnwza = queueMsg;
        }

        const queueEmbed = new EmbedBuilder()
            .setColor("Random")
            .setTitle(`รายการคิวเพลงทั้งหมด`)
            .setDescription(qlnwza)
            .setFooter({text: client.user.username})
            .setTimestamp();
        interaction.reply({embeds: [queueEmbed]}); 
    }
};