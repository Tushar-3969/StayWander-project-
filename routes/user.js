const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const User = require("../models/user.js")

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

module.exports = router;