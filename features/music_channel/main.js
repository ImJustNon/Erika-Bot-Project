const fs = require("fs");
const path = require("path");

module.exports = async client => {
    const eventFiles = fs.readdirSync(path.join(__dirname, "./events")).filter(file => file.endsWith(".js"));
    let loadedCount = 0;
    eventFiles.forEach(file =>{
        try{
            require(`./events/${file}`)(client);
            console.log(`[Music-Channel-Feature] Loaded Event : ${file}`);
            loadedCount++;
        }   
        catch(err){
            console.log(`[Music-Channel-Feature] Fail To Load : ${file} : ${err}`);
        } 
    });
    console.log(`[Music-Channel-Feature] Loaded Sussessful : ${loadedCount}`);
}