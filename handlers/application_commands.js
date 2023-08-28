const fs = require('fs');
const { Colors, ApplicationCommandsRegister, BetterConsoleLogger } = require('discord.js-v14-helper');

module.exports = (client, config) => {
    let commands = [];
    let filesCount = 0;
    fs.readdirSync('./commands/').forEach((dir) => {
        const files = fs.readdirSync('./commands/' + dir).filter((file) => file.endsWith('.js'));

        for (let file of files) {
            let pulled = require('../commands/' + dir + '/' + file);

            if (pulled.name && pulled.type) {
                console.log('[Commands-Handler] Loaded : ' + file);
                filesCount++;
                    

                if (pulled.description) {
                    commands.push({
                        name: pulled.name,
                        description: pulled.description,
                        type: 1,
                        options: pulled.options ? pulled.options : null,
                        default_permission: null,
                        default_member_permissions: null, 
                        nsfw: false
                    });
                } else {
                    commands.push({
                        name: pulled.name,
                        type: pulled.type
                    });
                };

                client.commands.set(pulled.name, pulled);
            } else {
                console.log('[Commands-Handler-Error] Received empty property \'name\' or \'type\' in ' + file + '.')
                continue;
            };
        };

        console.log(`[Commands-Handler] Loaded Successful : ${filesCount}`);
    });

    const register = new ApplicationCommandsRegister(config.client.token, config.client.id).setApplicationCommands(commands).setRestVersion(10);


    register.start().catch((data) => console.log(data.errors));
};