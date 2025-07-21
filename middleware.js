const Listing = require("./models/listing.js");
const { listingSchema,reviewSchema} = require("./validationSchema.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next()
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listings= await Listing.findById(id);
    if(!listings.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not the owner of the listings");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

//validation middleware
module.exports.validateListing=((req,res,next)=>{
    const { error } = listingSchema.validate(req.body);
     if(error){
        const errMsg = error.details.map(el=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    } else{
    next();
    }
});

module.exports.validateReview = ((req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.map((el)=>el.message).join(",");
        throw new ExpressError(404,errMsg)
    }
    else{
        next();
    }
});

module.exports.isAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let reviews= await Review.findById(reviewId);
    if(!reviews.author._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not the author of the reviews");
        return res.redirect(`/listings/${id}`)
    }
    next();
}