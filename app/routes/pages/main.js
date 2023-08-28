const express = require("express");
const { executeQuery } = require("../../../database/mysql_connection.js");
const router = express.Router();

const axios = require("axios");
const config = require("../../../config/config.js");

router.get('/main', async(req, res) => {
    return res.render("index.ejs", {
        PAGE: "MAIN",
        session: {
            isLogin: req.session.isLogin,
            user: req.session.user,
        },
    });
});

module.exports = router;