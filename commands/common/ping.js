const { executeQuery } = require("../../database/mysql_connection.js");

module.exports = {
    name: 'ping',
    description: 'เช็ค Ping บอท',
    type: 1,
    options: [],
    userPermissions: null,
    developers_only: false,
    category: 'common',
    callback: async ({client, interaction, config}) => {
        return interaction.reply({
            content: '`🏓` Pong! Lantency: ' + client.ws.ping + 'ms'
        });
    }
};