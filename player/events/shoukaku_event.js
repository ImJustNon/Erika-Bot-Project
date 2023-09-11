const { manager } = require("../manager.js");

module.exports = async(client) =>{
    manager.shoukaku.on('ready', (name) => console.log(`[Shoukaku] Lavalink ${name}: Ready!`));
    manager.shoukaku.on('error', (name, error) => console.error(`[Shoukaku] Lavalink ${name}: Error Caught,`, error));
    manager.shoukaku.on('close', (name, code, reason) => console.warn(`[Shoukaku] Lavalink ${name}: Closed, Code ${code}, Reason ${reason || 'No reason'}`));
    manager.shoukaku.on('debug', (name, info) => console.debug(`[Shoukaku] Lavalink ${name}: Debug,`, info));
    manager.shoukaku.on('disconnect', (name, players, moved) => {
        if (moved) return;
        players.map(player => player.connection.disconnect())
        console.warn(`[Shoukaku] Lavalink ${name}: Disconnected`);
    });
}