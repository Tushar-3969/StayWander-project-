const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


module.exports.createReview=async(req,res)=>{
    let listings = await Listing.findById(req.params.id);
    let review = new Review(req.body.review);

    review.author = req.user._id;
    listings.reviews.push(review);

    await review.save();
    await listings.save();
    req.flash("success","Review Created");
    res.redirect(`/listings/${listings._id}`);
};

module.exports.deleteReview=async(req,res)=>{
    let {id,reviewId}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`)
}

