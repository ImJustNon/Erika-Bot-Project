const { Connectors } = require("shoukaku");
const { Kazagumo, KazagumoTrack } = require("kazagumo");
const Spotify = require('kazagumo-spotify');
const Deezer = require('kazagumo-deezer');
const Nico = require('kazagumo-nico');

const config = require("../config/config.js");
const client = require("../index.js");

const Nodes = config.player.nodes;

const manager = new Kazagumo({
    defaultSearchEngine: "youtube",
    plugins: [
        new Spotify({
            clientId: config.player.apis.spotify.client_id,
            clientSecret: config.player.apis.spotify.client_secret,
        }),
        new Deezer({
            playlistLimit: 20,
        }),
        new Nico({ 
            searchLimit: 25 
        }),
    ],
    // MAKE SURE YOU HAVE THIS
    send: (guildId, payload) => {
        const guild = client.guilds.cache.get(guildId);
        if (guild) guild.shard.send(payload);
    }
}, new Connectors.DiscordJS(client), Nodes, {});


exports.manager = manager;