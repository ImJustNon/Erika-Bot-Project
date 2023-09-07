const fs = require("fs");
const path = require("path");

module.exports = async(client) => {
    client.on("ready", async() =>{
        const featureFolders = fs.readdirSync(path.join(__dirname, "../features")).filter(f => !f.endsWith(".js"));
        let filesCount = 0;
        featureFolders.forEach(folderName =>{
            const featureFiles = fs.readdirSync(path.join(__dirname, `../features/${folderName}`)).filter(file => file === ('main.js'));
            featureFiles.forEach(file => {
                try{
                    require(`../features/${folderName}/${file}`)(client);
                    console.log(`[Feature-Loader] Loaded Feature File : ${folderName}/${file}`);
                    filesCount++;
                }
                catch(err){
                    console.log(`[Feature-Loader] Error to Load : ${file} : ERROR : ${err}`);
                }
            }); 
        });
        console.log(`[Feature-Loader] Loaded Sussessful : ${filesCount}`);
    });
    
};
