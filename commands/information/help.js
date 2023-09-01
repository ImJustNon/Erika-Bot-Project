const { executeQuery } = require("../../database/mysql_connection.js");
const { manager } = require("../../player/manager.js");
const { EmbedBuilder, BaseSelectMenuBuilder } = require("discord.js");
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, ComponentType } = require('discord.js');
const config = require("../../config/config.js");

module.exports = {
    name: 'help',
    description: 'คำสั่งช่วยเหลือ',
    type: 1,
    options: [],
    role_perms: null,
    developers_only: false,
    category: 'information',
    callback: async ({client, interaction}) => {
        const cmdCategory = [];
        client.commands.map(c =>{
            if(!cmdCategory.includes(c.category)){
                cmdCategory.push(c.category);
            }
        });
        


        const menuOptionArray = [
            {
                label: "🏡 MAIN",
                value: "main",
            }
        ];
        for(let i = 0; i < cmdCategory.length; i++){
            menuOptionArray.push({
                label: cmdCategory[i].toUpperCase(),
                value: cmdCategory[i],
            });
        }
        const select = new StringSelectMenuBuilder().setCustomId('starter').setPlaceholder('เลือกประเภทคำสั่ง').addOptions(menuOptionArray);

		const row = new ActionRowBuilder()
			.addComponents(select);

            
        let embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle('🧭 | หน้าต่างช่วยเหลือ |')
            .addFields(
                [
                    {
                        name: '♻ | Github',
                        value: `[Source Code](${config.assets.src_github_url})`,
                        inline: true,
                    },
                    {
                        name: '💌 | Web',
                        value: `[Web Dashboard](https://erika-beta.nonlnwza.xyz)`,
                        inline: true,
                    },
                    {
                        name: '💞 | Credits',
                        value: `[Nonlnwza.xyz](https://bio.nonlnwza.xyz)`,
                        inline: true,
                    }
                ]
            )
            .setImage("https://cdn.discordapp.com/attachments/887363452304261140/964767665157730344/standard_8.gif");

		const response = await interaction.reply({
			embeds: [ embed ],
			components: [ row ],
		});

        const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 120 * 1000 });

        collector.on('collect', async i => {
            await i.deferUpdate();
            const selection = i.values[0];
            
            if(selection === "main"){ 
                return interaction.editReply({
                    embeds: [ embed ],
                });
            }

            const getCmdDataFromCategoryName = client.commands.filter(c => c.category === selection);
            const createEmbed = new EmbedBuilder()
                .setColor("Random")
                .setTitle(`🎮 | คำสั่งหมวดหมู่ **${selection.toUpperCase()}** | 🎮`)
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setImage("https://media.tenor.com/RfX4M6VqfRMAAAAC/rainbow-line.gif")
                .setFooter({ text: client.user.username })
                .setTimestamp();
                
            getCmdDataFromCategoryName.map(c => createEmbed.addFields({ name: `\`/${c.name}\``, value: c.description, inline: true }));

            interaction.editReply({
                embeds: [ createEmbed ],
                components: [ row ]
            });
        });
        collector.on('end', i => {
            interaction.editReply({
                content: `❗ | คำสั่งนี้หมดเวลาการใช้งานเเล้ว หากต้องการใช้สามารถใช้ \`/help\` ได้เลยนะ`,
                embeds: [],
                components: [],
            })
            setTimeout(() => interaction.deleteReply(), 25 * 1000);
        });
    }
};