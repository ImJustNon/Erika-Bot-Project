const express = require("express");
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const app = express();

require("dotenv").config();
const config = require("../config/config.js");

const http = require("http");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const bodyparser = require("body-parser");
const useragent = require("express-useragent");
const morgan = require("morgan");
const socketIo = require("socket.io");


// mongo session
const mongoDBStore = new MongoDBStore({
    uri: config.app.database.mongodb,
    collection: config.app.session.mongo_collection,
});
mongoDBStore.on('error', (error) => {
    console.log('[Session-Error] MongoDB Session Store Error:', error);
});
mongoDBStore.on('connected', (error) => {
    console.log('[Session] MongoDB Session Store : Connected');
    startListenPort();
});



const server = http.createServer(app);
const io = socketIo(server); 
require("./socket/index.js")(io);
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});
const jsonEncoded = express.json({
    limit: '50mb',
});
const logger = morgan(config.app.dev_mode ? "dev" : "combined");
const static_public = express.static(path.join(__dirname, './public'));
const static_libs = express.static(path.join(__dirname, '../node_modules'));


app.use(cors());
// MongoDB ver
app.use(session({
    secret: config.app.session.session_secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // config.app.session.secure === "true" ? true : false, // Set to true if using HTTPS
        // sameSite: 'none', // Allow cross-site cookies
        maxAge: 86400000,  // 86400000 ms = 1 day
    },
    store: mongoDBStore,
}));
app.use(useragent.express());
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.use(logger);
app.use(static_public);
app.use(static_libs);
app.use(jsonEncoded);
app.use(urlEncoded);


// routes loader
fs.readdirSync(path.join(__dirname, "./routes")).forEach(async folder => {
    fs.readdirSync(path.join(__dirname, `./routes/${folder}`)).forEach(async file =>{
        try {
            let router = require(`./routes/${folder}/${file}`);
            app.use(router);
            console.log(('[Route] ') + (`Loaded : ${folder}/${file}`));
        }
        catch (e){
            console.log(('[Route] ') + (`Fail to Load : ${folder}/${file} : `) + (e));
        }
    });
});

function startListenPort(){
    server.listen(config.app.port);
}
server.on("listening", async() =>{
    console.log(("> ") + (`Localhost : ${config.app.address}:${config.app.port}`));
    console.log(("> ") + (`Listening on port : `) + (config.app.port));
});
server.on("error", (err) =>{
    console.log("[APP-ERROR] " + err);
});