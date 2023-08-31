const { executeQuery } = require("../../database/mysql_connection.js");
const { manager } = require("../../player/manager.js");

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
        const voiceChannel = interaction.member.voice.channel;

        if(!voiceChannel) return interaction.reply("You need to be in a voice channel to use this command!");
        

        let player = await manager.createPlayer({
            guildId: interaction.guild.id,
            textId: interaction.channel.id,
            voiceId: interaction.member.voice.channel.id,
            volume: 80
        });

        let result = await manager.search(query, {
            requester: interaction.member.user.id,
        });
        if (!result.tracks.length) return interaction.reply("No results found!");

        if (result.type === "PLAYLIST") for (let track of result.tracks) player.queue.add(track);
        else player.queue.add(result.tracks[0]);

        if (!player.playing && !player.paused) player.play();
        return interaction.reply({content: result.type === "PLAYLIST" ? `Queued ${result.tracks.length} from ${result.playlistName}` : `Queued ${result.tracks[0].title}`});
    }
};