const express = require("express");
const { executeQuery } = require("../../../database/mysql_connection.js");
const router = express.Router();

const axios = require("axios");
const config = require("../../../config/config.js");

router.get("/api/bot/invite", async(req, res) =>{
    return res.redirect(config.assets.invite_url);
});

module.exports = router;