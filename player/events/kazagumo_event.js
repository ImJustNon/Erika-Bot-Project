
const { manager } = require("../manager.js");

module.exports = async(client) =>{
    manager.on("playerStart", (player, track) => {
        client.channels.cache.get(player.textId)?.send({content: `Now playing **${track.title}** by **${track.author}**`}).then(x => player.data.set("message", x));
    });
    
    manager.on("playerEnd", (player) => {
        player.data.get("message")?.edit({content: `Finished playing`});
    });
    
    manager.on("playerEmpty", player => {
        client.channels.cache.get(player.textId)?.send({content: `Destroyed player due to inactivity.`}).then(x => player.data.set("message", x));
        player.destroy();
    });
} 