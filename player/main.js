const fs = require('fs');

module.exports = async(client) =>{
    require('./manager.js');
    require('./player_creation.js')(client);
}