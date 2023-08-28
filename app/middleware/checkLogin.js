module.exports = {
    checkLogin: (req, res, next) => {
        if (req.session.isLogin) {
            next();
        } else {
            res.redirect("/p/login");
        }
    }
}