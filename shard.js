require("dotenv").config();
const { ShardingManager } = require('discord.js');
const config = require("./config/config.js");
const path = require("path");


const manager = new ShardingManager(path.join(__dirname, "./index.js"), {
    totalShards: 'auto',
    token: config.client.token,
    respawn: true,
    spawnTimeout: -1,
});

manager.on('shardCreate', (shard) =>{
    console.log(`[Shard] Launched shard ${shard.id}`);

    shard.on('disconnect', () => {
        console.log(`[Shard] Shard ${shard.id} disconnected. Respawning...`);
        manager.spawn(shard.id, 1, 5000); // Respawn the disconnected shard
    });    
});

manager.on('shardReady', (shard) => {
    console.log(`[Shard] Shard ${shard.id} is ready`);
});
  
manager.on('shardResume', (shard) => {
    console.log(`[Shard] Shard ${shard.id} has resumed`);
});
  

manager.on('shardError', (error, shardID) => {
    console.error(`[Shard] Shard ${shardID} encountered an error: `, error);
});

manager.spawn();