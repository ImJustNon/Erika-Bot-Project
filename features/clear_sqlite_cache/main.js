const { executeQuery } = require("../../database/mysql_connection.js");
const { sqliteExecute } = require("../../database/sqlite.js");
const config = require("../../config/config.js");

module.exports = async client => {
    (async(enable) =>{
        if(!enable) return;
        await ClearAutoVoiceChannelCache();
        await ClearMusicChannelCache();
    })(config.clearCacheWhenStart);

    async function ClearAutoVoiceChannelCache(){

    }
    async function ClearMusicChannelCache(){
        await sqliteExecute.run('DELETE FROM guild_music_channel_cache', []);
        console.log("[SQLite-Cache-Data] Clear Success : Music-Channel-Cache");
    }
}