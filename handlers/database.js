const fs = require("fs");
const path = require("path");
module.exports = async(client, config) => {
    const files = fs.readdirSync(path.join(__dirname + '/../database')).filter((file) => file.endsWith('.js'));
    let filesCount = 0;
    files.forEach(file =>{
        try{
            require(`../database/${file}`).connect();
            console.log(`[Database-Handler] Loaded Database : ${file}`);
            filesCount++;
        }
        catch(err){
            console.log(`[Database-Hanler-Error] Error to Load : ${file} : ERROR : ${err}`);
        }
    });
    console.log(`[Database-Hander] Loaded Sussessful : ${filesCount}`)
};
