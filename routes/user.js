const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirecturl } = require("../middleware.js");
const userController = require("../controllers/users.js");

//render sign up
router.get("/signup",userController.renderSignup);

//signup
router.post("/signup",wrapAsync(userController.signup));

//render login form
router.get("/login",userController.renderLogin);

//login
router.post("/login",
    saveRedirecturl,
    passport.authenticate("local",{failureRedirect : "/login",failureFlash:true}),
    userController.login
    );

//logout
router.get("/logout",userController.logout);
module.exports = router;