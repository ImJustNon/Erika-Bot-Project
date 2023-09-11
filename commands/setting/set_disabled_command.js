const { executeQuery } = require("../../database/mysql_connection.js");
const { manager } = require("../../player/manager.js");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    name: 'set-disable-cmd',
    description: 'ปิดการใช้งานคำสั่ง',
    type: 1,
    options: [
        {
            name: 'options',
            description: 'ตัวเลือกที่ต้อการจะใช้',
            type: 3,
            required: true,
            choices: [
                {
                    name: "Disable",
                    value: 'disable',
                },
                {
                    name: "Enable",
                    value: 'enable',
                },
                {
                    name: "Disable List",
                    value: 'disable_list',
                },
            ],
        },
        {
            name: 'command',
            description: 'ชื่อคำสั่ง (จำเป็นหากต้องการปิด หรือ เปิดใช้งาน)',
            type: 3,
            required: false,
        },
    ],
    userPermissions: [PermissionsBitField.Flags.Administrator],
    developers_only: false,
    category: 'setting',
    callback: async ({client, interaction, config, thisCommand}) => {
        const option = interaction.options.get("options").value;
        const commandName = interaction.options.get("command")?.value;

        if(option === "disable"){
            if(!commandName) return interaction.reply(`⚠ | โปรดระบุ ชิ่อคำสั่ง ที่ต้องการปิดการใช้งานด้วยน่ะ`);
            if(commandName == thisCommand.name) return interaction.reply(`⚠ | ไม่สามารถตั้งค่าคำสั่งนี้ได้`);
            await DisableCmd();
        }
        else if(option === "enable"){
            if(!commandName) return interaction.reply(`⚠ | โปรดระบุ ชิ่อคำสั่ง ที่ต้องการปิดการใช้งานด้วยน่ะ`);
            if(commandName == thisCommand.name) return interaction.reply(`⚠ | ไม่สามารถตั้งค่าคำสั่งนี้ได้`);
            await EnableCmd(commandName);
        }
        else if(option === "disable_list"){
            await DisableList();
        }
        


        async function DisableCmd(){
            const findCommand = client.commands.filter(c => c.name === commandName);
            if(findCommand.size === 0) return interaction.reply(`⚠ | ไม่พบคำสั่งชื่อ \`${commandName}\``);


            const getCurrentData = await executeQuery(`SELECT * FROM guild_disable_commands WHERE guild_id=? AND command_name=?`, [String(interaction.guildId), String(commandName)]);
            if(getCurrentData.error) return interaction.reply(`❌ | MySQL Error | โปรดลองใหม่ในภายหลัง`);
            if(getCurrentData.results.length !== 0) return interaction.reply(`⚠ | มีการตั้งค่าคำสั่งนี้อยู่ใน Database อยู่เเล้ว`);


            const insertData = await executeQuery(`INSERT INTO guild_disable_commands(guild_id, command_name, disable_by) VALUES(?,?,?)`, [String(interaction.guildId), String(commandName), String(interaction.member.user.id)]);
            if(insertData.error) return interaction.reply(`❌ | MySQL Error | โปรดลองใหม่ในภายหลัง`);
            
            
            return interaction.reply(`✅ | ทำการปิดการใช้งานคำสั่ง \`${commandName}\` เรียบร้อยเเล้ว`);
        }
        async function EnableCmd(){
            const findCommand = client.commands.filter(c => c.name === commandName);
            if(findCommand.size === 0) return interaction.reply(`⚠ | ไม่พบคำสั่งชื่อ \`${commandName}\``);


            const getCurrentData = await executeQuery(`SELECT * FROM guild_disable_commands WHERE guild_id=? AND command_name=?`, [String(interaction.guildId), String(commandName)]);
            if(getCurrentData.error) return interaction.reply(`❌ | MySQL Error | โปรดลองใหม่ในภายหลัง`);
            if(getCurrentData.results.length === 0) return interaction.reply(`⚠ | ไม่มีการตั้งค่าคำสั่งนี้อยู่ใน Database`);


            const deleteData = await executeQuery(`DELETE FROM guild_disable_commands WHERE guild_id=? AND command_name=?`, [String(interaction.guildId), String(commandName)]);
            if(deleteData.error) return interaction.reply(`❌ | MySQL Error | โปรดลองใหม่ในภายหลัง`);

            return interaction.reply(`✅ | ทำการเปิดการใช้งานคำสั่ง \`${commandName}\` เรียบร้อยเเล้ว`);
        }
        async function DisableList(){
            const getAllGuildDisableCommand = await executeQuery(`SELECT * FROM guild_disable_commands WHERE guild_id=?`, [String(interaction.guildId)]);
            if(getAllGuildDisableCommand.error) return interaction.reply(`❌ | MySQL Error | โปรดลองใหม่ในภายหลัง`);
            let makeDataString = "";
            for(let i = 0; i < getAllGuildDisableCommand.results.length; i++){
                makeDataString += `> \`${i + 1})\` **${getAllGuildDisableCommand.results[i].command_name}** : Disable by <@${getAllGuildDisableCommand.results[i].disable_by}> \n`
            }
            return interaction.reply({
                embeds: [
                    new EmbedBuilder().setColor("Random").setTitle(`⚙ | คำสั่งที่ปิดการใช้งานทั้งหมด \`${getAllGuildDisableCommand.results.length}\` คำสั่ง`).setDescription(makeDataString.length > 0 ? makeDataString : "> ไม่พบคำสั่งที่ปิดใช้งาน").setFooter({text: client.user.username}).setTimestamp(),
                ],  
            });
        }
    }
};