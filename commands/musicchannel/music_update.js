const { executeQuery } = require("../../database/mysql_connection.js");
const { sqliteExecute } = require("../../database/sqlite.js");
const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'music-update',
    description: 'อัปเดตการตั้งค่าช่องเล่นเพลง',
    type: 1,
    options: [],
    userPermissions: [PermissionsBitField.Flags.Administrator],
    developers_only: false,
    category: 'musicchannel',
    callback: async ({client, interaction}) => {
        const getChannelData = await executeQuery("SELECT * FROM guild_music_channel WHERE guild_id=?", [String(interaction.guild.id)]);
        if(getChannelData.results.length === 0) return await interaction.reply(`🟡 | ไม่พบข้อมูลช่องเล่นเพลง ในฐานข้อมูลเลยน่ะ`);

        const getMusicChannelCache = await sqliteExecute.get('SELECT * FROM guild_music_channel_cache WHERE guild_id=?', [String(interaction.guild.id)]);
        

        if(getMusicChannelCache.results.length === 0){
            await sqliteExecute.run('INSERT INTO guild_music_channel_cache(guild_id,channel_id,content_banner_id,content_queue_id,content_current_id) VALUES(?,?,?,?,?)', [
                String(getChannelData.results[0].guild_id), 
                String(getChannelData.results[0].channel_id), 
                String(getChannelData.results[0].content_banner_id), 
                String(getChannelData.results[0].content_queue_id), 
                String(getChannelData.results[0].content_current_id),
            ]); 
            return await interaction.reply("🟢 | ทำการเพิ่มข้อมูล เรียบร้อยเเล้ว");
        }
        else {
            await sqliteExecute.run('UPDATE guild_music_channel_cache SET guild_id=?,channel_id=?,content_banner_id=?,content_queue_id=?,content_current_id=? WHERE guild_id=?', [
                String(getChannelData.results[0].guild_id), 
                String(getChannelData.results[0].channel_id), 
                String(getChannelData.results[0].content_banner_id), 
                String(getChannelData.results[0].content_queue_id), 
                String(getChannelData.results[0].content_current_id),
                String(interaction.guild.id),
            ]);
            return await interaction.reply("🟢 | ทำการอัปเดตฐานข้อมูล เรียบร้อยเเล้ว");
        }
    }
};