const { executeQuery } = require("../../database/mysql_connection.js");
const { PermissionsBitField } = require("discord.js");

module.exports = {
    name: 'autovoicechannel-remove',
    description: 'ลบการตั้งค่าช่องเสียงอัตโนมัติ',
    type: 1,
    options: [
        {
            name: "channel",
            description: `เลือกช่องที่ต้องการตั้งค่า`,
            type: 7,
            required: true,
        },
    ],
    userPermissions: [PermissionsBitField.Flags.Administrator],
    developers_only: false,
    category: 'autovoicechannel',
    callback: async ({client, interaction, config}) => {
        const getChannel = interaction.options.get("channel");
        if(getChannel.channel.type !== 2) return interaction.reply('🟡 | สามารถตั้งค่าได้เฉพาะ \`ช่องเสียง\` เท่านั้นน่ะ');


        const getChannelData = await executeQuery("SELECT channel_id FROM guild_auto_voice_channel WHERE guild_id=? AND channel_id=?", [String(interaction.guild.id), String(getChannel.channel.id)]);
        if(getChannelData.error) return interaction.reply(`🔴 | MySQL Error | โปรดลองใหม่ในภายหลัง`);
        if(getChannelData.results.length === 0) return interaction.reply(`🟡 | ช่อง \`${getChannel.channel.name}\` ยังไม่ได้ถูกตั้งค่าน่ะ`);


        const removeChannelData = await executeQuery('DELETE FROM guild_auto_voice_channel WHERE guild_id=? AND channel_id=?', [String(interaction.guild.id), String(getChannel.channel.id)]);
        if(removeChannelData.error) return interaction.reply(`🔴 | MySQL Error | โปรดลองใหม่ในภายหลัง`);
        

        return interaction.reply(`🟢 | ลบช่อง \`${getChannel.channel.name}\` ออกจากการตั้งค่าเรียบร้อยเเล้ว`);
    }
};