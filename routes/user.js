const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const User = require("../models/user.js");
const passport = require("passport");

//signUp route
router.get("/signup",(req,res)=>{
    res.render("./users/signup.ejs");
});

router.post("/signup",async(req,res)=>{
    try{
        let {email,username,password}=req.body;
        let newUser = new User({
            email:email,
            username:username
        });
        let registerUser=await User.register(newUser,password);
        req.flash("success","Welcome to StayWander");
        console.log(registerUser);
        res.redirect("/listings");
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup")
    }
});

//login route
router.get("/login",(req,res)=>{
    res.render("./users/login.ejs")
});

router.post("/login",passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),wrapAsync(async(req,res)=>{
    req.flash("success","Welcome back to StayWander!");
    res.redirect("/listings");
}));

router.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings")
    })
});

module.exports = router;