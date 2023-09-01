const { executeQuery } = require("../../database/mysql_connection.js");
const { EmbedBuilder, version } = require('discord.js');

module.exports = {
    name: 'botinfo',
    description: 'เกี่ยวกับบอท บอท',
    type: 1,
    options: [],
    role_perms: null,
    developers_only: false,
    category: 'information',
    callback: async ({client, interaction, config}) => {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("Random")
                .setDescription(
                    `\n\n`
                )
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .addFields([
                    {
                    name: `🤖 Name`,
                    value: `>>> \`${client.user.username}\``,
                    inline: true,
                    },
                    {
                    name: `🏓 Ping`,
                    value: `>>> \`${client.ws.ping}ms\``,
                    inline: true,
                    },
                    {
                    name: `🎛️ Servers`,
                    value: `>>> \`${client.guilds.cache.size} Servers\``,
                    inline: true,
                    },
                    {
                    name: `👨‍👧‍👧 Users`,
                    value: `>>> \`${client.users.cache.size} Users\``,
                    inline: true,
                    },
                    {
                    name: `📂 Channels`,
                    value: `>>> \`${client.channels.cache.size} Channels\``,
                    inline: true,
                    },
                    {
                    name: `🔗 Node.js Version`,
                    value: `>>> \`${process.version}\``,
                    inline: true,
                    },
                    {
                    name: `🔗 Discord.js Version`,
                    value: `>>> \`${version}\``,
                    inline: true,
                    },
                    {
                    name: `🎮 Bot Commands`,
                    value: `>>> \`\`\` Commands ${client.commands.size} \`\`\``,
                    },
                    {
                    name: `⏳ Bot Uptime`,
                    value: `>>> \`\`\`${duration(client.uptime)
                        .map((i) => `${i}`)
                        .join(` , `)}\`\`\``,
                    },
                ])
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true })})
                .setTimestamp(),
            ],
            ephemeral: false,
        });
        
    }
};



function duration(duration, useMilli = false) {
    let time = parseDuration(duration);
    return formatTime(time, useMilli);
}
function formatTime(o, useMilli = false) {
    let parts = [];
    if (o.days) {
      let ret = o.days + " Day";
      if (o.days !== 1) {
        ret += "s";
      }
      parts.push(ret);
    }
    if (o.hours) {
      let ret = o.hours + " Hr";
      if (o.hours !== 1) {
        ret += "s";
      }
      parts.push(ret);
    }
    if (o.minutes) {
      let ret = o.minutes + " Min";
      if (o.minutes !== 1) {
        ret += "s";
      }
      parts.push(ret);
    }
    if (o.seconds) {
      let ret = o.seconds + " Sec";
      if (o.seconds !== 1) {
        ret += "s";
      }
      parts.push(ret);
    }
    if (useMilli && o.milliseconds) {
      let ret = o.milliseconds + " ms";
      parts.push(ret);
    }
    if (parts.length === 0) {
      return "instantly";
    } else {
      return parts;
    }
}
function parseDuration(duration) {
    let remain = duration;
    let days = Math.floor(remain / (1000 * 60 * 60 * 24));
    remain = remain % (1000 * 60 * 60 * 24);
  
    let hours = Math.floor(remain / (1000 * 60 * 60));
    remain = remain % (1000 * 60 * 60);
  
    let minutes = Math.floor(remain / (1000 * 60));
    remain = remain % (1000 * 60);
  
    let seconds = Math.floor(remain / 1000);
    remain = remain % 1000;
  
    let milliseconds = remain;
  
    return {
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
    };
}