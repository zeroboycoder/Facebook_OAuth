const express = require("express");
const route = express.Router();
const passport = require("passport");

const controller = require("../controllers/controllers");
const isLogged = require("../middlewares/isLogged").isLogged;

route.get("/auth/login", controller.getLogin);

route.get("/auth/logout", controller.getLogout);

route.get("/auth/facebook", passport.authenticate("facebook", { scope : 'email' } ) );

route.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

route.get("/", isLogged, controller.getIndex);

route.get("/profile", isLogged, controller.getProfile);

module.exports = route;