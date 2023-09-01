const { executeQuery } = require("../../database/mysql_connection.js");
const { manager } = require("../../player/manager.js");
const { EmbedBuilder } = require("discord.js");
const ytdl = require("ytdl-core");
const { convertTime } = require("../../player/utils/convertTime.js");
const { progressbar } = require("../../player/utils/progressbar.js");

module.exports = {
    name: 'nowplaying',
    description: 'ข้อมูลเพลงที่กำลังเปิดอยู่',
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

        
        let Np_embed = new EmbedBuilder()
            .setColor("Random")
            .setThumbnail(player.queue.current.thumbnail)
            .addFields([
                {
                    name: `🎵 | กำลังเล่นเพลง`,
                    value: `> [${player.queue.current.title}](${player.queue.current.uri})`,
                    inline: false,
                },
                {
                    name: `🎧 | ช่องฟังเพลง`,
                    value: `> <#${player.voiceId}>`,
                    inline: true,
                },
                {
                    name: `📢 | ขอเพลงโดย`,
                    value: `> <@${player.queue.current.requester}>`,
                    inline: true,
                },
                {
                    name: `⏱️ | ความยาว`,
                    value: `> \`${await convertTime(player.queue.current.length)}\``,
                    inline: true,
                },
                {
                    name: `🎙 | ศิลปิน`,
                    value: `> \`${player.queue.current.author}\``,
                    inline: true,
                },
                {
                    name: `🌀 | คิว`,
                    value: `> \`${player.queue.length}\``,
                    inline: true,
                },
                {
                    name: `🔁 | เปิดใช้วนซ้ำ`,
                    value: `> ${player.loop !== "none" ? "✅" : "❌"}`,
                    inline: true,
                },
                {
                    name: `🔊 | ระดับเสียง`,
                    value: `> \`${player.volume} %\``,
                    inline: true,
                },
            ])
            .setFooter({text: client.user.username})
            .setTimestamp();
        
        if(player.queue.current.uri.includes("youtube.com")){
            const info = await ytdl.getInfo(player.queue.current.identifier);
            const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
            Np_embed.addFields([
                {
                    name: `📥 | ดาวน์โหลดเพลง`, 
                    value: `> [\`คลิ๊กลิ้งนี้เพื่อโหลดเพลง\`](${format.url})`, 
                    inline: true 
                }
            ]);
        }

        Np_embed.addFields([
            {
                name: `᲼`, 
                value: `\`${await convertTime(player.position)}\` ${(await progressbar(player.position, player.queue.current.length, 18)).Bar} \`${await convertTime(player.queue.current.length)}\``,
                inline: false
            }
        ]);
    
        await interaction.reply({embeds: [ Np_embed ]});
    }
};