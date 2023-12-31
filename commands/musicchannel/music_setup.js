const { executeQuery } = require("../../database/mysql_connection.js");
const { sqliteExecute } = require("../../database/sqlite.js");
const { PermissionsBitField, EmbedBuilder, ChannelType, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const config = require("../../config/config.js");

module.exports = {
    name: 'music-setup',
    description: 'ตั้งค่าช่องเล่นเพลง',
    type: 1,
    options: [],
    userPermissions: [PermissionsBitField.Flags.Administrator],
    developers_only: false,
    category: 'musicchannel',
    callback: async ({client, interaction}) => {
        await interaction.reply("⌛ | กำลังตั้งค่าห้องเล่นเพลง กรุณารอซักครู่น่ะ");

        const checkCurrentData = await executeQuery("SELECT channel_id FROM guild_music_channel WHERE guild_id=?", [String(interaction.guild.id)]);
        if(checkCurrentData.results.length !== 0) return await interaction.editReply("🔴 | เซิฟเวอร์นี้ได้มีการตั้งค่าช่องเล่นเพลงไว้เเล้วน่ะ");

        await CreateChannelAndSetupMessage();
        await interaction.editReply("🟢 | ทำการตั้งค่าช่องเล่นเพลง เรียบร้อยเเล้ว");
        async function CreateChannelAndSetupMessage(){
            await interaction.guild.channels.create({
                name: `${client.user.username}-music`,
                type: ChannelType.GuildText,
                parent: null,
            }).then(async(ch) =>{
                const channelId = ch.id;
                const authorId = interaction.member.user.id;
                const guildId = interaction.guild.id;
                const createOn = String(new Date().getTime());

                await ch.setTopic(`play_pause: | หยุดเพลง หรือ เล่นเพลงต่อ :track_next: | ข้ามเพลง :stop_button: | ปิดเพลง :repeat: | เปิด/ปิด การใช้งานวนซ้ำ :twisted_rightwards_arrows: | สลับคิวเพลง :sound: | ลดเสียง :loud_sound: | เพิ่มเสียง :speaker: | ปิด/เปิดเสียง`);

                let contentBannerId = "";
                let contentqueueId = "";
                let contentCurrentId = "";

                await ch.send({
                    content: config.features.musicChannel.defaultBannerUrl,
                }).then(msg => contentBannerId = msg.id);
                await ch.send({
                    content: "**คิวเพลง:** \nเข้าช่องเสียง และพิมพ์ชื่อเพลงหรือลิงก์ของเพลง เพื่อเปิดเพลงน่ะ "
                }).then(msg => contentqueueId = msg.id);
                await ch.send({
                    embeds: [
                        new EmbedBuilder().setColor(config.features.musicChannel.defaultEmbedColor).setTitle("ยังไม่มีเพลงเล่นอยู่ ณ ตอนนี้").setImage(config.features.musicChannel.defaultTrackImageUrl).setFooter({ text: "ใช้ /help สำหรับคำสั่งเพิ่มเติม" }).setTimestamp(),
                    ],
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId(`music_pause`).setStyle(ButtonStyle.Success).setEmoji(`⏯`),
                            new ButtonBuilder().setCustomId(`music_skip`).setStyle(ButtonStyle.Secondary).setEmoji(`⏭`),
                            new ButtonBuilder().setCustomId(`music_stop`).setStyle(ButtonStyle.Danger).setEmoji(`⏹`),
                            new ButtonBuilder().setCustomId(`music_loop`).setStyle(ButtonStyle.Secondary).setEmoji(`🔁`),
                            new ButtonBuilder().setCustomId(`music_shuffle`).setStyle(ButtonStyle.Success).setEmoji(`🔀`),
                        ), 
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId(`music_volup`).setLabel(`เพิ่มเสียง`).setStyle(ButtonStyle.Primary).setEmoji(`🔊`),
                            new ButtonBuilder().setCustomId(`music_voldown`).setLabel(`ลดเสียง`).setStyle(ButtonStyle.Primary).setEmoji(`🔉`),
                            new ButtonBuilder().setCustomId(`music_mute`).setLabel(`ปิด/เปิดเสียง`).setStyle(ButtonStyle.Primary).setEmoji(`🔈`),
                        ),
                    ],
                }).then(msg => contentCurrentId = msg.id);

                await executeQuery('INSERT INTO guild_music_channel(guild_id,channel_id,author_id,create_on,content_banner_id,content_queue_id,content_current_id) VALUES(?,?,?,?,?,?,?)', [
                    String(guildId), 
                    String(channelId), 
                    String(authorId), 
                    String(createOn), 
                    String(contentBannerId), 
                    String(contentqueueId), 
                    String(contentCurrentId)
                ]);
            }).catch(() =>{});
        }
    }
};