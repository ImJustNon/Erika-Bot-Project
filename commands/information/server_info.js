const { executeQuery } = require("../../database/mysql_connection.js");
const { EmbedBuilder, version } = require('discord.js');
const os = require("os");
const moment = require("moment");
require("moment-duration-format");
const si = require("systeminformation");

module.exports = {
    name: 'serverinfo',
    description: 'เกี่ยวกับบอท เซิฟเวอร์บอท',
    type: 1,
    options: [],
    userPermissions: [],
    developers_only: false,
    category: 'information',
    callback: async ({client, interaction, config}) => {
        const duration1 = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
        const cpu = await si.cpu();
        let ccount = client.channels.cache.size;
        let scount = client.guilds.cache.size;
        let mcount = 0;
        client.guilds.cache.forEach((guild) => {
            mcount += guild.memberCount;
        });
        const statsEmbed = new EmbedBuilder()
        .setColor("Random")
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`🖥 **Status**
**========== STATISTICS ==========**
**• Servers** : ${scount}
**• Channels** : ${ccount}
**• Users** : ${mcount}
**• Discord.js** : v.${version}
**• Node** : ${process.version}
**========== SYSTEM ==========**
**• Platfrom** : ${os.type}
**• Uptime** : ${duration1}
**• CPU** : 
> **• Cores** : ${cpu.cores}
> **• Model** : ${os.cpus()[0].model} 
> **• Speed** : ${os.cpus()[0].speed} MHz
**• MEMORY** :
> **• Total Memory** : ${(os.totalmem() / 1024 / 1024).toFixed(2)} Mbps
> **• Free Memory** : ${(os.freemem() / 1024 / 1024).toFixed(2)} Mbps
> **• Heap Total** : ${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(
    2
    )} Mbps
> **• Heap Usage** : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
    2
    )} Mbps
`)
        .setFooter({ text: client.user.username})
        .setTimestamp();

        await interaction.reply({
            embeds: [ statsEmbed ],
        });
    }
}