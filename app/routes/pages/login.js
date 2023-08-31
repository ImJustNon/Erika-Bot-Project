const express = require("express");
const { executeQuery } = require("../../../database/mysql_connection.js");
const router = express.Router();

const axios = require("axios");
const config = require("../../../config/config.js");
const { checkLogin } = require("../../middleware/checkLogin.js");

router.get("/login", async(req, res) =>{
    const { isLogin } = req.session ?? {}; 
    if(isLogin) return res.redirect("/");

    return res.render("index.ejs", {
        PAGE: "LOGIN",
        session: {
            isLogin: req.session.isLogin,
            user: req.session.user,
        },
    });
});

module.exports = router;