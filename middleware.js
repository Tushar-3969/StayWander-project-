module.exports.isLoggedIn=(req,res)=>{
    if(!req.isAuthenticated()){
        req.flash("error","you must be logged in to create listing!");
        return res.redirect("/login")
    }
    next()
}