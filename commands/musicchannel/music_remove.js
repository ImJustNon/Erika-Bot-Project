const { executeQuery } = require("../../database/mysql_connection.js");
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
        
    }
};