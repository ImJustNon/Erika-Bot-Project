const express = require("express");
const { executeQuery } = require("../../../database/mysql_connection.js");
const router = express.Router();

const axios = require("axios");
const config = require("../../../config/config.js");
const client = require("../../../index.js");

router.get('/api/get/client', async(req, res) => {
    return res.json({
        status: "SUCCESS",
        error: null,
        data: {
            user: client.user,
        }
    });
});

module.exports = router;