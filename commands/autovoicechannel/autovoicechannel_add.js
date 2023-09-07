const { executeQuery } = require("../../database/mysql_connection.js");
const { PermissionsBitField } = require("discord.js");

module.exports = {
    name: 'autovc-add',
    description: 'เพิ่มการตั้งค่าช่องเสียงอัตโนมัติ',
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

        const checkAvailableChannel = await executeQuery("SELECT channel_id FROM guild_auto_voice_channel WHERE guild_id=?", [String(interaction.guild.id)]);
        if(checkAvailableChannel.error) return interaction.reply(`🔴 | MySQL Error | โปรดลองใหม่ในภายหลัง`);
        let foundCount = 0;
        checkAvailableChannel.results.forEach(ch =>{
            if(ch.channel_id === getChannel.channel.id) foundCount++;
        });
        if(foundCount !== 0) return interaction.reply(`🟡 | ช่อง \`${getChannel.channel.name}\` ได้ถูกตั้งค่าเอาไว้เเล้วน่ะ`);

        
        // limit 5 channel per guild
        if(checkAvailableChannel.results.length >= 5) return interaction.reply(`🟡 | เซิฟเวอร์นี้ได้ทำการตั้งค่าถึงสูงสุดเเล้ว โปรดลบช่องเก่าที่ไม่ได้ใช้ก่อนทำการตั้งค่าใหม่น่ะ`);


        const insertChannelData = await executeQuery("INSERT INTO guild_auto_voice_channel(guild_id,channel_id,author_id,create_on) VALUES(?,?,?,?)", [String(interaction.guild.id), String(getChannel.channel.id), String(interaction.member.id), String(new Date().getTime())]);
        if(insertChannelData.error) return interaction.reply(`🔴 | MySQL Error | โปรดลองใหม่ในภายหลัง`);

        
        return interaction.reply(`🟢 | ทำการตั้งค่าช่อง \`${getChannel.channel.name}\` เป็นช่องเสียงอัตโนมัติเรียบร้อยเเล้ว`);
    }
};