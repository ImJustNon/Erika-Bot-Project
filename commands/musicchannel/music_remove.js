const { executeQuery } = require("../../database/mysql_connection.js");
const { sqliteExecute } = require("../../database/sqlite.js");
const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'music-remove',
    description: 'ลบการตั้งค่าช่องเล่นเพลง',
    type: 1,
    options: [],
    userPermissions: [PermissionsBitField.Flags.Administrator],
    developers_only: false,
    category: 'musicchannel',
    callback: async ({client, interaction}) => {
        const getMusicChannelData = await executeQuery("SELECT * FROM guild_music_channel WHERE guild_id=?", [String(interaction.guild.id)]);
        if(getMusicChannelData.results.length === 0) return interaction.reply('🔴 | ไม่พบข้อมูลการตั้งค่าช่องเล่นเพลงน่ะ');
        
        const currentMusicChannel = await client.channels.cache.get(getMusicChannelData.results[0].channel_id);
        
        if(currentMusicChannel){
            await currentMusicChannel.delete().catch(() => {});
        }
        await executeQuery("DELETE FROM guild_music_channel WHERE guild_id=?", [String(interaction.guild.id)]);
        await sqliteExecute.run("DELETE FROM guild_music_channel_cache WHERE guild_id=?", [String(interaction.guild.id)]);
        return interaction.reply("🟢 | ทำการลบข้อมูลการตั้งค่าออกจากฐานข้อมูลเรียบร้อยเเล้ว");
    }
};