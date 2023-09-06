const { executeQuery } = require("../../database/mysql_connection.js");
const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'autovoicechannel-list',
    description: 'เเสดงการการตั้งค่าช่องเสียงอัตโนมัติทั้งหมด',
    type: 1,
    options: [],
    userPermissions: [PermissionsBitField.Flags.Administrator],
    developers_only: false,
    category: 'autovoicechannel',
    callback: async ({client, interaction, config}) => {
        let embed = new EmbedBuilder().setColor("Random").setTitle("⚙ | รายการช่องที่ตั้งค่าทั้งหมด").setFooter({text: client.user.username}).setTimestamp();
        const getAllChannelData = await executeQuery('SELECT * FROM guild_auto_voice_channel WHERE guild_id=?', [interaction.guild.id]);
        getAllChannelData.results.forEach(async chData =>{
            const date = new Date(parseInt(chData.create_on));
            const dateFormat = date.getHours() + ":" + date.getMinutes() + ", "+ date.toDateString();
            embed.addFields({
                name: `🔊 | <#${chData.channel_id}>`,
                value: `🔧 | <@${chData.author_id}> \n ⌛ | \`${dateFormat}\``,
                inline: true,
            });
        });

        return interaction.reply({
            embeds: [embed],
        });
    }
};