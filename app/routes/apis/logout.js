const express = require("express");
const { executeQuery } = require("../../../database/mysql_connection.js");
const router = express.Router();

const axios = require("axios");
const config = require("../../../config/config.js");

router.get("/api/auth/logout", async(req, res) =>{
    return req.session.destroy((err) => {
        if (err) {
            console.error('[Session-Error] Error destroying session:', err);
        }
        res.redirect('/main');
    });
});

module.exports = router;