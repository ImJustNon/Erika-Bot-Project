const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

module.exports = async (client, config) => {
    let commands = [];
    let filesCount = 0;

    fs.readdirSync('./commands/').forEach((dir) => {
        const files = fs.readdirSync('./commands/' + dir).filter((file) => file.endsWith('.js'));

        for (let file of files) {
            let pulled = require('../commands/' + dir + '/' + file);

            if (pulled.name && pulled.type) {
                console.log(`[Commands-Handler] Loaded : ${dir}/${file}`);
                filesCount++;
                    
                if (pulled.description) {
                    commands.push({
                        name: pulled.name,
                        description: pulled.description,
                        type: 1,
                        options: pulled.options ? pulled.options : [],
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
    });

    console.log(`[Commands-Handler] Loaded Successfully: ${filesCount}`);

    const rest = new REST({ version: '10' }).setToken(config.client.token);

    try {
        await rest.put(
            Routes.applicationCommands(config.client.id),
            { body: commands },
        );

        console.log('[Commands-Handler] Successfully registered application commands.');
    } catch (error) {
        console.error('[Commands-Handler] Failed to register application commands:', error);
    }
};
