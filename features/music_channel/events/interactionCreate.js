const { executeQuery } = require("../../../database/mysql_connection.js");
const { manager } = require("../../../player/manager.js");

module.exports = async client => {
    client.on("interactionCreate", async(interaction) =>{

        // check channel
        const textChannel = interaction.channel;
        // if(!textChannel.name.includes("music") && !textChannel.name.includes(`${client.user.username}-music`) && !textChannel.name.includes(`${client.user.username}`)) return;
        
        const getMusicChannelData = await executeQuery('SELECT * FROM guild_music_channel WHERE guild_id=? AND channel_id=?', [String(interaction.guild.id), String(interaction.channel.id)]);    
        if(getMusicChannelData.results.length === 0) return;
        
        const player = manager.players.get(interaction.guild.id);
        if(!player || !player.queue.current) return interaction.reply({
            content: '🟡 | ยังไม่มีการเล่นเพลง ณ ตอนนี้เลยน่ะ',
            ephemeral: true,
        });

        const channel = interaction.member.voice.channel;
        if(!channel) return interaction.reply({
            content: '🟡 | โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ',
            ephemeral: true,
        });

        const clientUser = interaction.guild.members.cache.get(client.user.id);
        if(clientUser.voice.channel && !channel.equals(clientUser.voice.channel)) return interaction.reply({
            content: '🟡 | ดูเหมือนว่าคุณจะไม่ได้อยู่ช่องเสียงเดียวกันน่ะ',
            ephemeral: true,
        });
    });
}