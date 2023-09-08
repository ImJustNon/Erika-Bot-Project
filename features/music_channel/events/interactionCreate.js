const { executeQuery } = require("../../../database/mysql_connection.js");
const { manager } = require("../../../player/manager.js");
const { EmbedBuilder } = require("discord.js");

module.exports = async client => {
    client.on("interactionCreate", async(interaction) =>{
        if(!interaction.isButton()) return;

        // check channel from channel name 
        if(!interaction.channel.name.includes("music") && !interaction.channel.name.includes(`${client.user.username}-music`) && !interaction.channel.name.includes(`${client.user.username}`)) return;
        
        // check channel from database
        const getMusicChannelData = await executeQuery('SELECT * FROM guild_music_channel WHERE guild_id=? AND channel_id=?', [String(interaction.guild.id), String(interaction.channel.id)]);    
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
    });
}