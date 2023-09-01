const { executeQuery } = require("../../database/mysql_connection.js");
const { manager } = require("../../player/manager.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'loop',
    description: 'วนเพลงซ้ำ',
    type: 1,
    options: [
        {
            name: "option",
            description: `เลือกการเล่นวนซ้ำ หรือ ปิดการใช้งาน`,
            type: 3,
            required: true,
            choices: [
                {
                    name: "เพลงเดียว",
                    value: 'track',
                },
                {
                    name: "ทั้งหมด",
                    value: 'queue',
                },
                {
                    name: "ปิดการใช้งาน",
                    value: 'disable',
                },
            ],
        },
    ],
    role_perms: null,
    developers_only: false,
    category: 'music',
    callback: async ({client, interaction, config}) => {
        const guild = client.guilds.cache.get(interaction.guildId)
        const member = guild.members.cache.get(interaction.member.user.id);
        const channel = member.voice.channel;

        const me = guild.members.cache.get(client.user.id);

        let player = manager.players.get(interaction.guild.id);

        if(!channel) return interaction.reply('⚠ | โปรดเข้าห้องเสียงก่อนใช้คำสั่งน่ะ');
        if(me.voice.channel && !channel.equals(me.voice.channel)) return interaction.reply('⚠ | ดูเหมือนว่าคุณจะไม่ได้อยู่ช่องเสียงเดียวกันน่ะ');
        if(!player || !player.queue.current) return interaction.reply('⚠ | ยังไม่มีการเล่นเพลง ณ ตอนนี้เลยน่ะ');

        const loop_type = interaction.options.get('option').value;
        if(loop_type === 'track'){
            if(player.loop === "track"){
                return interaction.reply(`⚠ | ทำการเปิดการวนซ้ำเเบบ \`เพลงเดียว\` อยู่น่ะ`);
            }
            player.setLoop("track"); 
            interaction.reply(`✅ | ทำการเปิดการวนซ้ำเเบบ \`เพลงเดียว\` เรียบร้อยเเล้ว`);
        }
        else if(loop_type === 'queue'){
            if(player.loop === "queue"){
                return interaction.reply(`⚠ | ทำการเปิดการวนซ้ำเเบบ \`ทั้งหมด\` อยู่นะ`);
            }
            player.setLoop("queue");
            interaction.reply(`✅ | ทำการเปิดการวนซ้ำเเบบ \`ทั้งหมด\` เรียบร้อยเเล้ว`);
        }
        else if(loop_type === 'disable'){
            if(player.loop === "none"){
                return interaction.reply('⚠ | ยังไม่มีการเปิดใช้งานการวนซ้ำเลยน่ะ');
            }
            player.setLoop("none");
            interaction.reply(`✅ | ทำการ \`ปิด\` การใช้งานวนซ้ำ เรียบร้อยเเล้ว`);
        }
    }
};