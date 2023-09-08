const { executeQuery } = require("../../database/mysql_connection.js");
const { sqliteExecute } = require("../../database/sqlite.js");

module.exports = async client => {
    client.on("ready", async() =>{
        await ClearAutoVoiceChannelCache();
        await ClearMusicChannelCache();
    });

    async function ClearAutoVoiceChannelCache(){
        
    }
    async function ClearMusicChannelCache(){

    }
}