const { GatewayIntentBits, Partials } = require('discord.js');

module.exports = {
    client: {
        constructor: {
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildBans,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.GuildIntegrations,
                GatewayIntentBits.GuildWebhooks,
                GatewayIntentBits.GuildInvites,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMessageTyping,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.DirectMessageReactions,
                GatewayIntentBits.DirectMessageTyping,
                GatewayIntentBits.MessageContent
            ],
            partials: [
                Partials.Channel,
                Partials.Message,
                Partials.User,
                Partials.GuildMember,
                Partials.Reaction
            ],
            // presence: {
            //     activities: [
            //         {
            //             name: "By nonlnwza.xyz",
            //             type: 0,
            //         },
            //     ],
            //     status: 'online',
            // },
        },
        token: process.env.CLIENT_TOKEN,
        id: process.env.CLIENT_ID,
        secret: process.env.CLIENT_SECRET,
    },
    // Database:
    database: {
        mongodb:{
            uri: process.env.MONGO_URI,
        },
        mysql: MysqlConfig,
    },
    app: {
        login: {
            callback_url: process.env.CALLBACK_URL,
        },
        session: {
            session_secret: "nonlnwza",
            mongo_collection: "erika-session"
        },
        database: {
            mongodb: process.env.MONGO_URI,
        },
        port: process.env.PORT,
        address: process.env.ADDRESS,
        dev_mode: process.env.DEV_MODE === "true" ? true : false
    },

    // APIs:
    apis: {
        
    },

    // Users:
    users: {
        developers: ["708965153131200594"],
        owner: "708965153131200594",
    }
};

function MysqlConfig(){
    const { MYSQL_SSL, MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;
    if(MYSQL_SSL === "true"){
        return {
            host: MYSQL_HOST,                                     
            user: MYSQL_USER,     
            password: MYSQL_PASSWORD,                                     
            port: parseInt(MYSQL_PORT),                                             
            database: MYSQL_DATABASE,                                                          
            ssl: {
                rejectUnauthorized: true,
            }, 
        }
    }
    else{
        return {
            host: MYSQL_HOST,                                     
            user: MYSQL_USER,     
            password: MYSQL_PASSWORD,                                     
            port: parseInt(MYSQL_PORT),                                             
            database: MYSQL_DATABASE,                                           
        }
    }
}