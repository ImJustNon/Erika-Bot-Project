const { manager } = require('../manager.js');
const { EmbedBuilder } = require("discord.js");

module.exports = async(client) =>{
    client.on("voiceStateUpdate", async (oldMember, newMember) =>{
        let player = await manager.players.get(newMember.guild.id);
        if(player){
            const voiceChannel = newMember.guild.channels.cache.get(player.voiceId);
            const textChannel = newMember.guild.channels.cache.get(player.textId);
            if(player.playing && voiceChannel.members.size < 2){
                player.destroy();
                // if(!player.paused){
                //     player.pause(true);
                //     textChannel.send({
                //         embeds: [new EmbedBuilder().setColor("Random").setTitle(`⏸️ | กำลังหยุดชั่วคราว`)],
                //     });
                // }
            }
            // else {
            //     if(player.paused){
            //         player.pause(false);
            //         textChannel.send({
            //             embeds: [new EmbedBuilder().setColor("Random").setTitle(`⏯️ | กำลังเล่นต่อจากเดิม`)],
            //         });
            //     }
            // }
        } 
    });
}