const { executeQuery } = require("../../../database/mysql_connection.js");
const { sqliteExecute } = require("../../../database/sqlite.js");
const { manager } = require("../../../player/manager.js");
const { EmbedBuilder } = require("discord.js");
const { queueMessage } = require("../functions/queueMessage.js");
const { trackEmbed } = require("../functions/trackEmbed.js");

module.exports = client => {
    client.on("messageCreate", async(message) =>{
        if(message.author.bot || message.author.username === client.user.username) return;
        if(!message.guild) return

        // first check if channel name have follow keyword
        const textChannel = message.channel;
        if(!textChannel.name.includes("music") && !textChannel.name.includes(`${client.user.username}-music`) && !textChannel.name.includes(`${client.user.username}`)) return;

        // then check bt use database
        const getMusicChannelData = await sqliteExecute.get('SELECT * FROM guild_music_channel_cache WHERE guild_id=? AND channel_id=?', [String(message.guild.id), String(message.channel.id)]);
        if(getMusicChannelData.results.length === 0) return;


        const messageContent = message.content;
        
        setTimeout(async() =>{
            await message.delete();
        }, 1000);

        const channel = await message.channel;
        const bannerContent = await channel.messages.fetch(getMusicChannelData.results[0].content_banner_id);
        const queueContent = await channel.messages.fetch(getMusicChannelData.results[0].content_queue_id);
        const trackContent = await channel.messages.fetch(getMusicChannelData.results[0].content_current_id);
        const memberVoiceChannel = await message.member.voice.channel;

        if(!trackContent || !queueContent || !bannerContent){
            return message.channel.send('🔴 | โครงสร้างข้อความในช่องนี้ เกิดข้อผิดพลาด');
        } 
        if(!memberVoiceChannel){  
            return message.channel.send('🟡 | โปรดเข้าช่องเสียงก่อนเปิดเพลงน่ะ').then((msg) =>{
                setTimeout(async() =>{
                    await msg.delete();
                }, 5000);
            });
        }
        if(message.guild.me?.voice.channel && !memberVoiceChannel.equals(message.guild.me.voice.channel)){
            return message.channel.send('🟡 | เอ๊ะ! ดูเหมือนว่าคุณจะไม่ได้อยู่ในช่องเสียงเดียวกันน่ะ').then((msg) =>{
                setTimeout(async() =>{
                    await msg.delete();
                }, 5000);
            });
        }

        let player = manager.players.get(message.guild.id);
        
        if(!player){
            player = await manager.createPlayer({
                guildId: message.guild.id,
                textId: message.channel.id,
                voiceId: memberVoiceChannel.id,
                volume: 80,
            });
        }
        if(player.state !== 0){
            player.connect();
        }
        const result = await manager.search(messageContent, {
            requester: message.member.user.id,
        });


        if(!result.tracks.length){ 
            return await message.channel.send(`🔴 | ไม่พบผลการค้นหาสำหรับ ${query}`).then((msg) =>{
                setTimeout(async() =>{
                    await msg.delete();
                }, 5000);
            });
        }
        if(result.type === "PLAYLIST"){ 
            for(let track of result.tracks){
                player.queue.add(track);
            }
            await message.channel.send(`🟢 | เพิ่ม \`${result.tracks.length}\` รายการ จาก Playlist: \`${result.playlistName}\` เรียบร้อยเเล้ว`).then((msg) =>{
                setTimeout(async() =>{
                    await msg.delete();
                }, 5000);
            });
        }
        else{
            player.queue.add(result.tracks[0]);
            await message.channel.send(`🟢 | เพิ่ม \`${result.tracks[0].title}\` เรียบร้อยเเล้ว`).then((msg) =>{
                setTimeout(async() =>{
                    await msg.delete();
                }, 5000);
            });
        }

        if (!player.playing && !player.paused){
            await player.play();
        }
        
        await queueContent.edit({ content: await queueMessage(client, player) });
    });
}