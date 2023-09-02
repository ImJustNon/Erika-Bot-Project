const { manager } = require('../manager.js');

module.exports = async(client) =>{
    client.on("voiceStateUpdate", async(oldState, newState) =>{
        let player = await manager.players.get(newState.guild.id);

        if(player){
            if (oldState.channelId === null || typeof oldState.channelId == 'undefined') return;
            if (newState.id !== client.user.id) return;

            player.destroy();
        }   
    });
}