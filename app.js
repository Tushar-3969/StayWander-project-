const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Listing = require("./models/listing.js")
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./validationSchema.js");
const Review = require("./models/review.js");


main().then(()=>{
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

//validation middleware
const validateListing=((req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
     if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
    next();
    }
});

const validateReview = ((req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.map((el)=>el.message).join(",");
        throw new ExpressError(404,errMsg)
    }
    else{
        next();
    }
});

//Index Route
app.get("/listings",wrapAsync(async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}));

//Create Route
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs");
});

app.post("/listings",validateListing,wrapAsync(async(req,res,next)=>{
    let listings= new Listing(req.body.listing);
    await listings.save();
    res.redirect("./listings");
}));

//Show Route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listings = await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs",{listings});
}));

//update Route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listings = await Listing.findById(id);
    res.render("./listings/edit.ejs",{listings});
}));

app.put("/listings/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//Review Route
//post review route
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
    let listings = await Listing.findById(req.params.id);
    let review = new Review(req.body.review);

    await review.save();
    listings.reviews.push(review._id);
    await listings.save();
    res.redirect(`/listings/${listings._id}`);
}));

//delete review route
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`)
}));

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