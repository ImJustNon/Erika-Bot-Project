const fs = require("fs");
const path = require("path")
module.exports = async(client) =>{
    // Player Event
    const files = fs.readdirSync(path.join(__dirname, './events')).filter((file) => file.endsWith('.js'));
    let filesCount = 0;
    files.forEach(file =>{
        try{
            require(`./events/${file}`)(client);
            console.log(`[Player] Loaded Event : ${file}`);
            filesCount++;
        }
        catch(err){
            console.log(`[Player] Error to Load : ${file} : ERROR : ${err}`);
        }
    });
    console.log(`[Player] Loaded Sussessful : ${filesCount}`);

    // Guild Event
    const guildEventFiles = fs.readdirSync(path.join(__dirname, './guild_events')).filter((file) => file.endsWith('.js'));
    let guildEventFilesCount = 0;
    guildEventFiles.forEach(file =>{
        try{
            require(`./guild_events/${file}`)(client);
            console.log(`[Player-Guild-Event] Loaded Event : ${file}`);
            guildEventFilesCount++;
        }
        catch(err){
            console.log(`[Player-Guild-Event] Error to Load : ${file} : ERROR : ${err}`);
        }
    });
    console.log(`[Player-Guild-Event] Loaded Sussessful : ${guildEventFilesCount}`);
}