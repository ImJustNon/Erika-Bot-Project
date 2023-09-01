const { executeQuery } = require("../../database/mysql_connection.js");
const { manager } = require("../../player/manager.js");
const { EmbedBuilder, Embed } = require("discord.js");

module.exports = {
    name: 'play',
    description: 'เล่นเพลงใน VoiceChannel',
    type: 1,
    options: [
        {
            name: 'search',
            description: 'พิมพ์สิ้งที่ต้องการค้นหา หรือ ลิ้งค์',
            type: 3,
            required: true,
        },
    ],
    role_perms: null,
    developers_only: false,
    category: 'music',
    callback: async ({client, interaction, config}) => {
        const query = interaction.options.get('search').value;
        const guild = client.guilds.cache.get(interaction.guildId)
        const member = guild.members.cache.get(interaction.member.user.id);
        const channel = member.voice.channel;

        const me = guild.members.cache.get(client.user.id);

        if(!channel) return interaction.reply('⚠ | โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ');
        if(me.voice.channel && !channel.equals(me.voice.channel)) return interaction.reply('⚠ | ดูเหมือนว่าคุณจะไม่ได้อยู่ช่องเสียงเดียวกันน่ะ');
        if(!query) return interaction.reply('⚠ | โปรดระบุเพลงที่ต้องการด้วยน่ะ');



        let player = manager.players.get(interaction.guild.id);
        if(!player){
            player = await manager.createPlayer({
                guildId: interaction.guild.id,
                textId: interaction.channel.id,
                voiceId: member.voice.channel.id,
                volume: 80
            });
        }


        if(player.state !== 0){
            player.connect();
        }
        let result = await manager.search(query, {
            requester: interaction.member.user.id,
        });



        if(!result.tracks.length){ 
            return interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor("Random").setDescription(`❌ | ไม่พบผลการค้นหาสำหรับ ${query}`),
                ],
            });
        }
        if(result.type === "PLAYLIST"){ 
            for(let track of result.tracks){
                player.queue.add(track);
            }
            interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor("Random").setDescription(`✅ | เพิ่มเพลง \`${result.tracks.length}\` รายการ จาก Playlist: \`${result.playlistName}\` เรียบร้อยเเล้ว`),
                ],
            });
        }
        else{
            player.queue.add(result.tracks[0]);
            interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor("Random").setDescription(`✅ | เพิ่มเพลง \`${result.tracks[0].title}\` เรียบร้อยเเล้ว`),
                ],  
            });
        }

        if (!player.playing && !player.paused){
            player.play();
        }
    }
};