if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require('passport-local');
const User = require("./models/user.js");


main()
.then(()=>{
    console.log("connection Successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.ATLASDB_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());  
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);


const store = MongoStore.create({
    mongoUrl:process.env.ATLASDB_URL,
    crypto: {
        secret: process.env.SECREATE
    },
    touchAfter: 24*3600,
});

store.on("error",(err)=>{
    console.log("ERROR in  MONGO SESSION STORE",err)
})

const sessionOption = {
    store,
    secret:process.env.SECREATE,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true
    }
}


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());  
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});

//Error Handler middleware
app.use((err,req,res,next)=>{
    let {status=500,message="something went wrong!"}=err;
    res.status(status).render("./error.ejs",{err})
});

app.listen(port,()=>{
    console.log(`App is Listening on:${port}`);
});