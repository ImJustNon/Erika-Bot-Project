const { executeQuery } = require("../../database/mysql_connection.js");
const { sqliteExecute } = require("../../database/sqlite.js")
module.exports = {
    name: 'test',
    description: 'ลองคำสั่ง',
    type: 1,
    options: [],
    userPermissions: [],
    developers_only: false,
    category: 'test',
    callback: async ({client, interaction, config}) => {
        const results = await sqliteExecute("SELECT * FROM guild_current_voice_channel", []);
        console.log(results);
    }
};