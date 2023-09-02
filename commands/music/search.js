const { executeQuery } = require("../../database/mysql_connection.js");
const { manager } = require("../../player/manager.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'search',
    description: 'ค้นหาเพลงที่ใช่',
    type: 1,
    options: [
        {
            name: 'query',
            description: 'สามารถใส่ URL หรือ ค้นหา ได้',
            type: 3,
            required: true,
        },
    ],
    userPermissions: [],
    developers_only: false,
    category: 'music',
    callback: async ({client, interaction, config}) => {
        const guild = client.guilds.cache.get(interaction.guild.id);
        const member = guild.members.cache.get(interaction.member.user.id);
        const channel = member.voice.channel;
        const textChannel = client.channels.cache.get(interaction.channel.id);

        const me = guild.members.cache.get(client.user.id);

        let player = manager.players.get(interaction.guild.id);

        if(!channel) return interaction.reply('⚠ | โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ');
        if(me.voice.channel && !channel.equals(me.voice.channel)) return interaction.reply('⚠ | ดูเหมือนว่าคุณจะไม่ได้อยู่ช่องเสียงเดียวกันน่ะ');

        const query = interaction.options.get("query").value;
        const results = await manager.search(query, {
            requester: interaction.member.user.id,
        });
        const tracks = results.tracks.slice(0, 20);
        let resultsDescription = "";
	    let counter = 1;

        for(const track of tracks){
            resultsDescription += `\`${counter}\` [${track.title}](${track.uri}) \n`;
            counter++;
        }

        const embed = new EmbedBuilder()
            .setTitle(`🔎 | รายการการค้นหาของ ${query}`)
            .setDescription(resultsDescription)
            .setColor("Random")
            .setFooter({text: client.user.username})
            .setTimestamp();

        interaction.reply({ 
            content: "โปรดเลือกตัวเลือกที่ต้องการจากรายการด้านล่างได้เลยน่ะ",
            embeds: [ embed ],
        });
        
        const response = await textChannel.awaitMessages({ 
            filter: (msg) => msg.author.id === interaction.member.user.id,
            max: 1,
            time: 30000,
        });
        const answer = await response.first().content;
        const track = tracks[answer - 1];

        if(player){
            player.queue.add(track);
            return textChannel.send({ embeds: [ new EmbedBuilder().setColor("Random").setDescription(`✅ | เพิ่มเพลง \`${track.title}\` เรียบร้อยเเล้ว`)]});
        }
        else {
            player = await manager.createPlayer({
                guildId: interaction.guild.id,
                textId: interaction.channel.id,
                voiceId: member.voice.channel.id,
                volume: 80
            });
            if(player.state !== 0){ 
                player.connect();
            }
            player.queue.add(track);
            player.play();
            textChannel.send({
                embeds: [ new EmbedBuilder().setColor("Random").setDescription(`✅ เพิ่มเพลง \`${track.title}\` เรียบร้อยเเล้ว`) ],
            });
        }
    }
};