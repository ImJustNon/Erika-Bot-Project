const express = require("express");
const { executeQuery } = require("../../../database/mysql_connection.js");
const router = express.Router();

const axios = require("axios");
const config = require("../../../config/config.js");

router.get("/api/bot/invite", async(req, res) =>{
    return res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${config.client.id}&permissions=150314937471&scope=bot%20applications.commands`)
});

module.exports = router;