const User = require("../models/user");

exports.getLogin = (req, res, next) => {
    res.render("login", {
        title : "Login"
    })
}

exports.getLogout = (req, res, next) => {
    req.session.destroy(err => {
        err ? console.log(err) : res.redirect("/auth/login");
    })
}

exports.getIndex = (req, res, next) => {
    res.render("index", {
        title : "OAuth Authentication"
    })
}

exports.getProfile = (req, res, net) => {
    const userData = req.user;
    User.find({userId : userData.id})
    .then(users => {
        res.render("profile", {
            title : "My Profile",
            users : users
        })
    })
    .catch(err => {
        throw new Error("Can't find profile")
    })
}