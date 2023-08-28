const fs = require("fs");
const path = require("path");
module.exports = async(client, config) => {
    const files = fs.readdirSync(path.join(__dirname + '/../events')).filter((file) => file.endsWith('.js'));
    let filesCount = 0;
    files.forEach(file =>{
        try{
            require(`../events/${file}`);
            console.log(`[Events-Handler] Loaded Event : ${file}`);
            filesCount++;
        }
        catch(err){
            console.log(`[Events-Handler-Error] Error to Load : ${file} : ERROR : ${err}`);
        }
    });
    console.log(`[Events-Handler] Loaded Sussessful : ${filesCount}`)
};
