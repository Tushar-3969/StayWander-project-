const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listings.js");
const reviews = require("./routes/review.js")

main()
.then(()=>{
    console.log("connection Successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());  
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);


app.use("/listings",listings);

app.use("/listings/:id/reviews",reviews);

app.get("/",(req,res)=>{
    res.send("Hi i am root");
});

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