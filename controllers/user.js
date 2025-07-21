const User = require("../models/user.js");

module.exports.renderSignUpForm=(req,res)=>{
    res.render("./users/signup.ejs");
}

module.exports.signUp =async(req,res,next)=>{
    try{
        let {email,username,password}=req.body;
        let newUser = new User({
            email:email,
            username:username
        });
        let registerUser=await User.register(newUser,password);
        req.logIn(registerUser,(err)=>{
            if(err){
                next(err);
            };
            req.flash("success","Welcome to StayWander");
            res.redirect("/listings");
        }); 
        } 
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup")
        }
}

module.exports.renderLogin=(req,res)=>{
    res.render("./users/login.ejs")
}

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome back to StayWander!");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}

module.exports.logOut=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings")
    })
}