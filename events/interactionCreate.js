const client = require('../index');
const config = require('../config/config.js');
const { executeQuery } = require("../database/mysql_connection.js");

client.on('interactionCreate', async (interaction) => {
    if(interaction.isChatInputCommand()){
        const command = await client.commands.get(interaction.commandName);
        
        // check if incalid command
        if(!command){
            return interaction.reply({
                content: `❌ ไม่พบคำสั่งนี้ โปรดลองใหม่ในภายหลังน่ะ`,
                ephemeral: true,
            });
        }

        try{    
            const data = await executeQuery("SELECT command_name FROM guild_disable_commands WHERE guild_id=?", [String(interaction.guildId)]);
            if(data.results.length !== 0){ 
                for(let i = 0; i < data.results.length; i++){
                    if(data.results[i].command_name === command.name){
                        return interaction.reply({
                            content: `❌ | คำสั่งนี้ได้ถูกปิดใช้งานในเซิฟเวอร์นี้`,
                            ephemeral: true,
                        });
                    }
                }
            }

            if (command.owner_only && command.owner_only === true) {
                if (interaction.user.id !== config.users.owner) {
                    return interaction.reply({
                        content: `❌ | คำสั่งนี้สามารถสำหรับ Owner เท่านั้น`,
                        ephemeral: true,
                    });
                }
            }

            if (command.developers_only && command.developers_only === true) {
                if (config.users?.developers && config.users?.developers?.length > 0) {
                    if (!config.users.developers.some((dev) => interaction.user.id === dev)) {
                        return interaction.reply({
                            content: `❌ | คำสั่งนี้สามารถสำหรับ Developer เท่านั้น`,
                            ephemeral: true,
                        });
                    }
                }
            }

            if (command.userPermissions && command.userPermissions !== null) {
                if (Array.isArray(command.userPermissions)) {
                    if (command.userPermissions.length > 0) {
                        const checkPerms = interaction.member.permissions.has(command.userPermissions);

                        if (!checkPerms){
                            return interaction.reply({
                                content: `❌ | คุณไม่มีสิทธิใช้คำสั่งนี้น่ะ`,
                                ephemeral: true,
                            });
                        }
                    }
                }
            }

            await command.callback({client, interaction, config, thisCommand: command});
        }
        catch(err){
            console.error(`[Error] Failed to run the command \'${interaction.commandName}\'. Error : ${err}`);
            return interaction.reply({
                content: `⚠ | โปรดลองใหม่ในภายหลังน่ะ`,
                ephemeral: true,
            });
        }
        finally {
            console.log(`[Alert] ${interaction.user.username} has used the command \'${interaction.commandName}\'.`);
        };
    }
    else if(interaction.isMessageContextMenuCommand){
    }
    else if(interaction.isUserContextMenuCommand){
    }
    else return;
});
