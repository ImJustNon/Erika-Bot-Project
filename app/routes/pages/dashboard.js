const express = require("express");
const { executeQuery } = require("../../../database/mysql_connection.js");
const router = express.Router();

const axios = require("axios");
const config = require("../../../config/config.js");
const { checkLogin } = require("../../middleware/checkLogin.js");

router.get("/dashboard", checkLogin, async(req, res) =>{
    const { server_id, page } = req.query ?? {}; 

    if(!server_id){
        
    }
    if(!page){

    }
    return res.render("index.ejs", {
        PAGE: "DASHBOARD",
        session: {
            isLogin: req.session.isLogin,
            user: req.session.user,
        },
    });
});

module.exports = router;