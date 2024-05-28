const { Captcha, CaptchaGenerator } = require('captcha-canvas');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { sqliteExecute } = require("../../database/sqlite.js");
const randomColor = require('randomcolor');
const radom_Color = randomColor({
    luminosity: 'bright',
    hue: 'random'
});

module.exports = client => {
    client.on('guildMemberAdd', async(member) => {
        const getGuildCaptchaData = await sqliteExecute.get('SELECT * FROM guild_captcha_cache WHERE guild_id=?', [String(member.guild.id)]);
        if(getGuildCaptchaData.results.length === 0) return;

        const roleID = getGuildCaptchaData.results[0].new_role_id;
        const roleRemoveID = getGuildCaptchaData.results[0].old_role_id;
        const guildLogCh = getGuildCaptchaData.results[0].log_channel_id;
        const timeOut = getGuildCaptchaData.results[0].captcha_timeout;

        if(member.user.bot) return;

        const captcha = new Captcha();
        captcha.async = true;
        captcha.addDecoy();
        captcha.drawTrace();
        captcha.drawCaptcha();


        const attachment = new AttachmentBuilder(await captcha.png, `captcha.png`);

        const embed = new EmbedBuilder()
            .setColor(radom_Color)
            .setDescription(`โปรดพิมพ์สิ่งที่คุณเห็นในภาพนี้เพื่อยืนยันตัวตน\nโดย \`มีเวลา ${String(timeOut)} วินาที\` ในการยืนยัน`)
            .setImage('attachment://captcha.png')
            .setFooter({ text: client.user.username })
            .setTimestamp();

        const msg = await member.send({
            embeds: [embed],
            files: [attachment],
        });

        const filter = (message) =>{ 
            if(message.author.id !== member.id) return;
            if(message.content === captcha.text) return true;
            else member.send('🟡 | การยืนยันตัวตนผิดพลาด โปรดลองอีกครั้งน่ะ');
        }

        try{
            const response = await msg.channel.awaitMessages({
                filter: filter,
                max: 1,
                time: parseInt(timeOut) * 1000,
                errors: ["time"],
            });
            if(response){
                member.send('🟢 | การยืนยันตัวตนถูกต้องค่ะ!');
//                 if(roleID !== "null"){
//                     let checkrole = member.guild.roles.cache.find(r => r.id === roleID);
//                     if((member.guild.members).roles.highest.position > checkrole.rawPosition){
//                         if(checkrole){
//                             if(!member.roles.cache.has(checkrole.id)){
//                                 await member.roles.add(checkrole.id);
//                                 member.send(`:inbox_tray: | ได้ทำการเพิ่มยศ ${checkrole.name} ให้เรียบร้อยค่ะ`);
//                             }
//                         }
//                     }
//                 }
//                 if(roleRemoveID !== "null"){
//                     let checkroleremove = member.guild.roles.cache.find(r => r.id === roleRemoveID);
//                     if(member.guild.member.roles.highest.position > checkroleremove.rawPosition){
//                         if(checkroleremove){
//                             if(member.roles.cache.has(checkroleremove.id)){
//                                 await member.roles.remove(checkroleremove.id);
//                                 member.send(`:outbox_tray: | ได้ทำการนำยศ ${checkroleremove.name} ออกเรียบร้อยค่ะ`);
//                             }
//                         }
//                     }
//                 }
//                 if(guildLogCh !== "null"){
//                     const guildlog = member.guild.channels.cache.get(guildLogCh);
//                     if(guildlog){
//                         const logembed = new EmbedBuilder()
//                             .setColor('#425bff')    
//                             .setTitle('บันทึกการยืนยันตัวตน')
//                             .setDescription(`\`\`\`asciidoc
// สมาชิก    :: ${member.user.username}
// ไอดี      :: ${member.user.id}
// การยืนยัน  :: ยืนยันเเล้ว
// รหัสยืนยัน  :: ${captcha.text}
// \`\`\``)
//                             .setFooter({ text: client.user.username })
//                             .setTimestamp()
//                         await guildlog.send(logembed);
//                     }
//                 }
            }
        }
        catch(err){
            await member.send('🔴 | เนื่องจากคุณหมดเวลาในการยืนยันตัวตนเเล้ว จำเป็นต้องเตะคุณออกจากเซิฟเวอร์นี้ค่ะ');
            await member.kick('หมดเวลายืนยันตัวตน');
            console.log(err);
        }
    });
}