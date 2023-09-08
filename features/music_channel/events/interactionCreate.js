const { executeQuery } = require("../../../database/mysql_connection.js");
const { sqliteExecute } = require("../../../database/sqlite.js");
const { manager } = require("../../../player/manager.js");
const { EmbedBuilder } = require("discord.js");
const { trackEmbed } = require("../functions/trackEmbed.js");
const { queueMessage } = require("../functions/queueMessage.js");

module.exports = async client => {
    client.on("interactionCreate", async(interaction) =>{
        if(!interaction.isButton()) return;

        // check channel from channel name 
        if(!interaction.channel.name.includes("music") && !interaction.channel.name.includes(`${client.user.username}-music`) && !interaction.channel.name.includes(`${client.user.username}`)) return;
        
        // check channel from database
        const getMusicChannelData = await sqliteExecute.get('SELECT * FROM guild_music_channel_cache WHERE guild_id=? AND channel_id=?', [String(interaction.guild.id), String(interaction.channel.id)]);    
        if(getMusicChannelData.results.length === 0) return;
        

        const player = manager.players.get(interaction.guild.id);
        const channel = interaction.member.voice.channel;
        const bot = interaction.guild.members.cache.get(client.user.id);

        // check bot is available for use
        if(!player || !player.queue.current){
            return interaction.reply({
                content: '🟡 | ยังไม่มีการเล่นเพลง ณ ตอนนี้เลยน่ะ',
                ephemeral: true,
            });
        }
        if(!channel){
            return interaction.reply({
                content: '🟡 | โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ',
                ephemeral: true,
            });
        }
        if(bot.voice.channel && !channel.equals(bot.voice.channel)){
            return interaction.member.send({
                embeds: [
                    new EmbedBuilder().setDescription('🔴 | ตอนนี้มีคนกำลังใช้งานอยู่น่ะ').setColor("Red").setFooter({ text: client.user.username }).setTimestamp(),
                ],
            }).then(async msg =>{
                await msg.react('🚫').catch(err => console.log(err));
                setTimeout(async() =>{
                    await msg.delete();
                }, 15000);
            });
        }


        const trackContent = await interaction.channel.messages.fetch(await getMusicChannelData.results[0].content_current_id);
        const queueContent = await interaction.channel.messages.fetch(await getMusicChannelData.results[0].content_queue_id);

        // button duty
        if(interaction.customId === 'music_pause'){
            if(!player.paused){
                player.pause(true);
                await interaction.reply('🟢 | ทำการหยุดเพลงชั่วคราวเรียบร้อยเเล้วค่ะ').then(async(i) =>{ 
                    setTimeout(async() =>{
                        await interaction.deleteReply();
                    }, 5000);
                });
            }
            else if(player.paused){
                player.pause(false);
                await interaction.reply('🟢 | ทำการเล่นเพลงต่อเเล้วค่ะ').then(async() =>{ 
                    setTimeout(async() =>{
                        await interaction.deleteReply();
                    }, 5000); 
                });
            } 
        }
        else if(interaction.customId === 'music_skip'){
            player.skip();
            await interaction.reply('🟢 | ทำการข้ามเพลงให้เรียบร้อยเเล้วค่ะ').then(async() =>{ 
                setTimeout(async() =>{
                    await interaction.deleteReply();
                }, 5000); 
            });
        }
        else if(interaction.customId === 'music_stop'){
            if(player.playing){
                player.destroy();
                await interaction.reply('🟢 | ทำการปิดเพลงเรียบร้อยเเล้วค่ะ').then(async() =>{ 
                    setTimeout(async() =>{
                        await interaction.deleteReply();
                    }, 5000); 
                });
            }
        }
        else if(interaction.customId === 'music_loop'){
            if(player.loop === "none"){
                player.setLoop("queue");
                await interaction.reply(`🟢 | ทำการเปิดการวนซ้ำเพลงเเบบ \`ทั้งหมด\` เรียบร้อยเเล้วค่ะ`).then(async() =>{ 
                    await trackContent.edit({ embeds: [await trackEmbed(client, player)]});
                    setTimeout(async() =>{
                        await interaction.deleteReply();
                    }, 5000); 
                });
            }
            else if(player.loop === "queue"){
                player.setLoop("track");
                await interaction.reply(`🟢 | ทำการเปิดการวนซ้ำเพลงเเบบ \`เพลงเดียว\` เรียบร้อยเเล้วค่ะ`).then(async() =>{ 
                    await trackContent.edit({ embeds: [await trackEmbed(client, player)]});
                    setTimeout(async() =>{
                    await interaction.deleteReply();
                    }, 5000); 
                });
            }
            else if(player.loop === "track"){
                player.setLoop("none");
                await interaction.reply(`🟢 | ทำการปิดวนซ้ำเพลงเรียบร้อยเเล้วค่ะ`).then(async() =>{ 
                    await trackContent.edit({ embeds: [await trackEmbed(client, player)]});
                    setTimeout(async() =>{
                        await interaction.deleteReply();
                    }, 5000); 
                });
            }
        }
        else if(interaction.customId === 'music_shuffle'){
            if(!player.queue || !player.queue.length || player.queue.length == 0){
                await interaction.reply('🟡 | เอ๊ะ! ดูเหมือนว่าคิวของคุณจะไม่มีความยาวมากพอน่ะคะ').then(async() =>{ 
                    setTimeout(async() =>{
                        await interaction.deleteReply();
                    }, 5000); 
                });
            }
            else{
                player.queue.shuffle();
                await interaction.reply('🟢 | ทำการสุ่มเรียงรายการคิวใหม่เรียบร้อยเเล้วค่ะ').then(async() =>{ 
                    await queueContent.edit({ content: await queueMessage(client, player)});
                    setTimeout(async() =>{
                        await interaction.deleteReply();
                    }, 5000); 
                });
            }
        }
        else if(interaction.customId === 'music_volup'){
            let newVol = (player.volume * 100) + 10;
            if(newVol < 110){
                player.setVolume(newVol);
                await interaction.reply(`🟢 | ทำการปรับความดังเสียงเป็น \`${newVol}\` เรียบร้อยเเล้วค่ะ`).then(async() =>{ 
                    await trackContent.edit({ embeds: [ await trackEmbed(client, player) ]});
                    setTimeout(async() =>{
                        await interaction.deleteReply();
                    }, 5000); 
                });
            }
            else if(newVol >= 110){
                await interaction.reply(`🟡 | ไม่สามารถปรับความดังเสียงได้มากกว่านี้เเล้วค่ะ`).then(async() =>{ 
                    setTimeout(async() =>{
                        await interaction.deleteReply();
                    }, 5000); 
                });
            }
        }
        else if(interaction.customId === 'music_voldown'){
            let newVol = (player.volume * 100) - 10;
            if(newVol > 0){
                player.setVolume(newVol);
                await interaction.reply(`🟢 | ทำการปรับความดังเสียงเป็น \`${newVol}\` เรียบร้อยเเล้วค่ะ`).then(async() =>{ 
                    await trackContent.edit({ embeds: [ await trackEmbed(client, player) ]});
                    setTimeout(async() =>{
                        await interaction.deleteReply();
                    }, 5000); 
                });
            }   
            else if(newVol < 0){
                await interaction.reply(`🟡 | ไม่สามารถปรับความดังเสียงได้น้อยกว่านี้เเล้วค่ะ`).then(async() =>{ 
                    setTimeout(async() =>{
                        await interaction.deleteReply();
                    }, 5000); 
                });
            }  
        }
        else if(interaction.customId === 'music_mute'){
            if(player.volume > 0){
                player.setVolume(0);
                await interaction.reply(`🟢 | ทำการปิดเสียงเรียบร้อยเเล้วค่ะ`).then(async() =>{ 
                    await trackContent.edit(await trackEmbed(client, player));
                    setTimeout(async() =>{
                        await interaction.deleteReply();
                    }, 5000); 
                });
            }
            else if(player.volume === 0){
                player.setVolume(player.options.volume);
                await interaction.reply(`🟢 | ทำการเปิดเสียงเรียบร้อยเเล้วค่ะ`).then(async() =>{ 
                    await trackContent.edit(await trackEmbed(client, player));
                    setTimeout(async() =>{
                        await interaction.deleteReply();
                    }, 5000); 
                });
            }
        }
    });
}