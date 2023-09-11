const { executeQuery } = require("../../database/mysql_connection.js");
const { sqliteExecute } = require("../../database/sqlite.js");
const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'autovc-update',
    description: 'อัปเดตการตั้งค่าช่องเสียงอัตโนมัติ',
    type: 1,
    options: [],
    userPermissions: [PermissionsBitField.Flags.Administrator],
    developers_only: false,
    category: 'autovoicechannel',
    callback: async ({client, interaction}) => {
        const getChannelData = await executeQuery("SELECT * FROM guild_auto_voice_channel WHERE guild_id=?", [String(interaction.guild.id)]);
        if(getChannelData.results.length === 0) return await interaction.reply(`🟡 | ไม่พบข้อมูลช่องเล่นเพลง ในฐานข้อมูลเลยน่ะ`);

        const getAutoChannelCache = await sqliteExecute.all('SELECT * FROM guild_auto_voice_channel_cache WHERE guild_id=?', [String(interaction.guild.id)]);
       
        if(getAutoChannelCache.results.length !== 0){
            await sqliteExecute.run("DELETE FROM guild_auto_voice_channel_cache WHERE guild_id=?", [String(interaction.guild.id)]);
        }

        await getChannelData.results.forEach(async(channelData) =>{
            await sqliteExecute.run("INSERT INTO guild_auto_voice_channel_cache(guild_id,channel_id,author_id,create_on) VALUES(?,?,?,?)", [String(interaction.guild.id), String(channelData.channel_id), String(channelData.author_id), String(channelData.create_on)])
        });
        
        await interaction.reply("🟢 | ทำการอัปเดตฐานข้อมูล เรียบร้อยเเล้ว");
    }
};