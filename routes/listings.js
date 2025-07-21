const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner,validateListing} = require("../middleware.js");


//Index Route
router.get("/",wrapAsync(async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}));

//Create Route
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("./listings/new.ejs");
});

router.post("/",isLoggedIn,validateListing,wrapAsync(async(req,res,next)=>{
    let listings= new Listing(req.body.listing);
    listings.owner=req.user._id;
    await listings.save();
    req.flash("success","New Listing Created");
    res.redirect("./listings");
}));

//Show Route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listings = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listings){
        req.flash("error","Listings does not exists");
        res.redirect("/listings");
    };
    res.render("./listings/show.ejs",{listings});
}));

//update Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listings = await Listing.findById(id);
    res.render("./listings/edit.ejs",{listings});
}));

router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listings Updated");
    if(!listings){
        req.flash("error","Listings does not exists");
        res.redirect("/listings");
    };
    res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}));

module.exports = router;