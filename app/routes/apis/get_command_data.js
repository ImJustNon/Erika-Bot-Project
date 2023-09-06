const express = require("express");
const { executeQuery } = require("../../../database/mysql_connection.js");
const router = express.Router();

const axios = require("axios");
const config = require("../../../config/config.js");
const client = require("../../../index.js");

router.get('/api/get/commands', async(req, res) => {
    const { category } = req.query ?? {};

    if(!category){
        const commandData = await client.commands.map(c => c);
        const sendCommandDataArray = [];
        await commandData.forEach(c => {
            sendCommandDataArray.push({
                name: c.name,
                description: c.description,
                type: c.type,
                options: c.options,
                // userPermissions: c.userPermissions,
                developers_only: c.developers_only,
                category: c.category,
            });            
        });
        return res.json({
            status: "SUCCESS",
            error: null,
            data: {
                commands: sendCommandDataArray,
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