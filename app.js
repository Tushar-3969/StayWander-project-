const express = require("express");
const app = express();
const mongoose = require('mongoose');
const port = 8080;
const path = require("path");
const methodOverride = require('method-override');
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

main().then(() => {
    console.log("Connection successfully");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/", (req, res) => {
    res.send("hi I am root");
});

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews)

app.all("*",(req,res,next)=>{
     next(new ExpressError(404,"Page Not Found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong!"}=err;
    res.status(statusCode).render("error.ejs",{message});
});

app.listen(port, () => {
    console.log("Server is listening on 8080");
});
