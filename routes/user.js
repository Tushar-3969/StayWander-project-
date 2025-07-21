const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/user.js");

//signUp route
router.route("/signup")
    .get(userController.renderSignUpForm)
    .post(userController.signUp);


//login route
router.route("/login")
    .get(userController.renderLogin)
    .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),wrapAsync(userController.login));


//log out route
router.get("/logout",userController.logOut);

module.exports = router;