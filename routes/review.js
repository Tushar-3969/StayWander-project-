const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema} = require("../validationSchema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


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


//Review Route
//post review route
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let listings = await Listing.findById(req.params.id);
    let review = new Review(req.body.review);

    await review.save();
    listings.reviews.push(review);
    await listings.save();
    req.flash("success","Review Created");
    res.redirect(`/listings/${listings._id}`);
}));

//delete review route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`)
}));

module.exports = router;