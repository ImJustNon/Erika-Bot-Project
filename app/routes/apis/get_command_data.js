const express = require("express");
const { executeQuery } = require("../../../database/mysql_connection.js");
const router = express.Router();

const axios = require("axios");
const config = require("../../../config/config.js");
const client = require("../../../index.js");

router.get('/api/get/commands', async(req, res) => {
    const { category } = req.query ?? {};

    if(!category){
        return res.json({
            status: "SUCCESS",
            error: null,
            data: {
                commands: await client.commands.map(c => c),
            },
        });
    }
    
    return res.json({
        status: "SUCCESS",
        error: null,
        data: {
            commands: await client.commands.filter(c => c.category === category),
        }
    });
});

module.exports = router;