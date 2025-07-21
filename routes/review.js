const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { validateReview, isLoggedIn, isAuthor} = require("../middleware.js");


//Review Route
//post review route
router.post("/",isLoggedIn,validateReview,wrapAsync(async(req,res)=>{
    let listings = await Listing.findById(req.params.id);
    let review = new Review(req.body.review);

    review.author = req.user._id;
    listings.reviews.push(review);

    await review.save();
    await listings.save();
    req.flash("success","Review Created");
    res.redirect(`/listings/${listings._id}`);
}));

//delete review route
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`)
}));

module.exports = router;