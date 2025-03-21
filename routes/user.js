const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

router.get("/signup", (req,res)=>{
    res.render("users/signup.ejs")
});

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let {username,password,email}=req.body;
        const newUser=new User({username,email});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                next(err);
            }
            req.flash("success","Welcome to StayWander");
            res.redirect("/listings");
        })
    } 
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    };
}));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
});

router.post("/login",passport.authenticate("local",{ failureRedirect:"/login",failureFlash:true}),async (req,res)=>{
    req.flash("success","Welcome Back to StayWander!");
    res.redirect("/listings");
});

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
          return next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
    })
});

module.exports = router;