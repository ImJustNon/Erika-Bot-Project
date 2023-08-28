const express = require("express");
const { executeQuery } = require("../../../database/mysql_connection.js");
const router = express.Router();

const axios = require("axios");
const config = require("../../../config/config.js");

router.get("/api/auth/discord", async(req, res) =>{
    const params = new URLSearchParams({
        client_id: config.client.id,
        redirect_uri: config.app.login.callback_url,
        response_type: 'code',
        scope: 'identify email',
    });

    res.redirect(`https://discord.com/api/oauth2/authorize?${params}`);
});

router.get('/api/auth/discord/callback', async(req, res) =>{
    const { code } = req.query ?? {};

    if(!code){
        return res.json({
            status: "FAIL",
            error: "code missing",
        });
    }

    try {
        const response = await axios.post('https://discord.com/api/oauth2/token', `client_id=${config.client.id}&client_secret=${config.client.secret}&code=${code}&grant_type=authorization_code&redirect_uri=${config.app.login.callback_url}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const { access_token } = response.data;

        // Fetch user data from Discord API using the access token
        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        const user = userResponse.data;

        // Save user data in the session
        req.session.user = user;
        req.session.isLogin = true;

        res.redirect('/main'); // Redirect to the home
    } catch (err) {
        console.error('[API-Error] Error exchanging code for access token:', err);
        res.json({
            status: "FAIL",
            error: err,
        });
    }
});

module.exports = router;