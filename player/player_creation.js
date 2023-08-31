const fs = require("fs");
const path = require("path")
module.exports = async(client) =>{
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
    console.log(`[Player] Loaded Sussessful : ${filesCount}`)
}