const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema} = require("../validationSchema.js");
const Listing = require("../models/listing.js");

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
router.get("/",wrapAsync(async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}));

//Create Route
router.get("/new",(req,res)=>{
    res.render("./listings/new.ejs");
});

router.post("/",validateListing,wrapAsync(async(req,res,next)=>{
    let listings= new Listing(req.body.listing);
    await listings.save();
    res.redirect("./listings");
}));

//Show Route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listings = await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs",{listings});
}));

//update Route
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listings = await Listing.findById(id);
    res.render("./listings/edit.ejs",{listings});
}));

router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

module.exports = router;