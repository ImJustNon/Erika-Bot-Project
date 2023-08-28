const client = require('../index');
const config = require('../config/config.js');
const { executeQuery } = require("../database/mysql_connection.js");

client.on('interactionCreate', async (interaction) => {
    if (interaction.isChatInputCommand() || interaction.isUserContextMenuCommand() || interaction.isMessageContextMenuCommand()) {
        const command = await client.commands.get(interaction.commandName);
        
        // check if incalid command
        if(!command){
            return interaction.reply({
                content: `\`❌\` ไม่พบคำสั่งนี้ โปรดลองใหม่ในภายหลังน่ะ`,
                ephemeral: true,
            });
        }

        try{    
            const data = await executeQuery("SELECT command_name FROM guild_disable_commands WHERE guild_id=?", [String(interaction.guildId)]);
            if(data.results.length !== 0){ 
                for(let i = 0; i < data.results.length; i++){
                    if(data.results[i].command_name === command.name){
                        return interaction.reply({
                            content: `\`❌\` คำสั่งนี้ได้ถูกปิดใช้งานในเซิฟเวอร์นี้`,
                            ephemeral: true,
                        });
                    }
                }
            }

            if (command.owner_only && command.owner_only === true) {
                if (interaction.user.id !== config.users.owner) {
                    return interaction.reply({
                        content: `\`❌\` คำสั่งนี้สามารถสำหรับ Owner เท่านั้น`,
                        ephemeral: true
                    });
                }
            }

            if (command.developers_only && command.developers_only === true) {
                if (config.users?.developers && config.users?.developers?.length > 0) {
                    if (!config.users.developers.some((dev) => interaction.user.id === dev)) {
                        return interaction.reply({
                            content: `\`❌\` คำสั่งนี้สามารถสำหรับ Developer เท่านั้น`,
                            ephemeral: true
                        });
                    }
                }
            }

            if (command.role_perms && command.role_perms !== null) {
                if (Array.isArray(command.role_perms)) {
                    if (command.role_perms?.length > 0) {
                        let boolean = false;

                        await command.role_perms.forEach((r) => {
                            const role = interaction.guild.roles.cache.get(r);

                            if (!role) return;

                            if (!interaction.member.roles) boolean = false;
                            if (interaction.member.roles.cache.some((r1) => r1.id === role.id)) boolean = true;
                        });

                        if (boolean === false){
                            return interaction.reply({
                                content: `\`❌\` คุณไม่มีสิทธิใช้คำสั่งนี้น่ะ`,
                                ephemeral: true,
                            });
                        }
                    }
                } else if (typeof command.role_perms === 'string') {
                    const role = interaction.guild.roles.cache.get(command.role_perms);

                    if (role) {
                        if (!interaction.member.roles.cache.has(role)){ 
                            return interaction.reply({
                                content: `\`❌\` คุณไม่มีสิทธิใช้คำสั่งนี้น่ะ`,
                                ephemeral: true,
                            });
                        }
                    }
                }
            }

            command.callback({client, interaction, config});
        }
        catch(err){
            console.error(`[Error] Failed to run the command \'${interaction.commandName}\'.`);
            return interaction.reply({
                content: `\`⚠\` โปรดลองใหม่ในภายหลังน่ะ`,
                ephemeral: true,
            });
        }
        finally {
            console.log(`[Alert] ${interaction.user.username} has used the command \'${interaction.commandName}\'.`);
        };
    }
    else return;
});
