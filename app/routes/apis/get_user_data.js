const express = require("express");
const { executeQuery } = require("../../../database/mysql_connection.js");
const router = express.Router();

const axios = require("axios");
const config = require("../../../config/config.js");
const client = require("../../../index.js");

router.get("/api/get/user/:userId", async(req, res) =>{
    const { userId } = req.params ?? {};

    const fetchUserId = client.users.cache.get(userId);

    if(!fetchUserId){
        return res.json({
            status: "FAIL",
            error: "Cant fetch user data",
        });
    }

    return res.json({
        status: "SUCCESS",
        error: null,
        data: {
            userData: fetchUserId,
        }
    });
});

module.exports = router;