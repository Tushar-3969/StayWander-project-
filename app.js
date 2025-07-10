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
const {listingSchema} = require("./validationSchema.js");


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


//Index Route
app.get("/listings",wrapAsync(async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}));

//New Route
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
    let listings = await Listing.findById(id);
    res.render("./listings/show.ejs",{listings});
}));

//update Route
app.get("/listings/:id/edit",validateListing,wrapAsync(async(req,res)=>{
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