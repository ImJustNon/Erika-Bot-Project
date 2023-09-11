const { executeQuery } = require("../../database/mysql_connection.js");
const { sqliteExecute } = require("../../database/sqlite.js");
const { ChannelType, PermissionsBitField } = require("discord.js");

module.exports = client => {
    // Reset Channel nad Database When Startup
    new Promise(async resolve =>{
        setTimeout(async() => {
            try {
                const getAllAutoChannelCache = await sqliteExecute.get('SELECT * FROM guild_current_voice_channel', []);
                getAllAutoChannelCache.results.forEach(async voiceChannelData =>{
                    const guild = client.guilds.cache.get(voiceChannelData.guild_id);
                    const voiceChannel = guild.channels.cache.get(voiceChannelData.channel_id);
                    if(!voiceChannel){
                        await sqliteExecute.run('DELETE FROM guild_current_voice_channel WHERE guild_id=? AND channel_id=?', [String(voiceChannelData.guild_id), String(voiceChannelData.channel_id)]);
                    }
                    else {
                        if(voiceChannel.members.size >= 1) return;
                        await sqliteExecute.run('DELETE FROM guild_current_voice_channel WHERE guild_id=? AND channel_id=?', [String(voiceChannelData.guild_id), String(voiceChannelData.channel_id)]);
                        await voiceChannel.delete().catch(() => {});
                    }
                });
            }
            catch {}
            resolve(2);
        }, 30 * 1000);
    });
    client.on('voiceStateUpdate', async(oldState, newState) => {
        // Join Channel
        if(newState.channel && !oldState.channel){
            const getJoinChannelData = await sqliteExecute.get('SELECT * FROM guild_auto_voice_channel_cache WHERE guild_id=? AND channel_id=?', [String(newState.guild.id), String(newState.channel.id)]);
            if(getJoinChannelData.results.length === 0) return;
            await CreateVoiceChannel(newState);
            return;
        }
        // Left Channel
        if(oldState.channel && !newState.channel){
            const getCurrentGuildChannelData = await sqliteExecute.get('SELECT * FROM guild_current_voice_channel WHERE guild_id=? AND channel_id=?', [String(oldState.guild.id), String(oldState.channel.id)]);
            if(getCurrentGuildChannelData.results.length == 0) return;
            const voiceChannel = oldState.guild.channels.cache.get(getCurrentGuildChannelData.results[0].channel_id);
            if(voiceChannel.members.size >= 1)  return;
            await sqliteExecute.run('DELETE FROM guild_current_voice_channel WHERE guild_id=? AND channel_id=?', [String(oldState.guild.id), String(oldState.channel.id)]);
            await voiceChannel.delete().catch(() => {});
            return;
        }
        // Switch Channel
        if(oldState.channel && newState.channel){
            if(oldState.channel.id === newState.channel.id) return;
            const getJoinChannelData = await sqliteExecute.get('SELECT * FROM guild_auto_voice_channel_cache WHERE guild_id=? AND channel_id=?', [String(newState.guild.id), String(newState.channel.id)])
            if(getJoinChannelData.results.length !== 0){
                await CreateVoiceChannel(newState);
            }
            const getAutoChannelCache = await sqliteExecute.get('SELECT * FROM guild_current_voice_channel WHERE guild_id=? AND channel_id=?', [String(oldState.guild.id), String(oldState.channel.id)]);
            if(getAutoChannelCache.results.length === 0) return;
            const voiceChannel = await oldState.guild.channels.cache.get(getAutoChannelCache.results[0].channel_id);
            if(voiceChannel.members.size >= 1) return;
            await sqliteExecute.run("DELETE FROM guild_current_voice_channel WHERE guild_id=? AND channel_id=?", [String(oldState.guild.id), String(oldState.channel.id)]);
            await voiceChannel.delete().catch(() => {});
            return;
        }
    });

    // Create Voice Channel
    async function CreateVoiceChannel(state){
        const channelParent = state.channel.parent ? state.channel.parent.id : null;
        await state.guild.channels.create({
            name: `${state.member.user.username}'s Room`,
            type: ChannelType.GuildVoice,
            parent: channelParent,
        }).then(async newVoiceChannel =>{
            await state.member.voice.setChannel(newVoiceChannel);
            await sqliteExecute.run('INSERT INTO guild_current_voice_channel(guild_id,channel_id,parent_id,author_id,create_on) VALUES(?,?,?,?,?)', [String(state.guild.id), String(state.channel.id), String(channelParent !== null ? channelParent : "0"), String(state.member.id), String(new Date().getTime())]);
            await newVoiceChannel.permissionOverwrites.set([
                {
                    id: state.member.id,
                    allow: [PermissionsBitField.Flags.ManageChannels],
                },
                {
                    id: state.guild.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },
            ]);
        });
    }
}