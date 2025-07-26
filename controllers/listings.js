const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports.index = async (req,res)=>{
    let {category,q}= req.query;
    let allListings;
    if(q){
        allListings=await Listing.find({
            $or:[
                {title:{$regex:q,$options:"i"}},
                {location:{$regex:q,$options:"i"}},
                {description:{$regex:q,$options:"i"}}
            ]
        });
        if(allListings==0){
            throw new ExpressError(404,"No listings available at the moment.")
        }
    }
    else if(category){
        allListings = await Listing.find({category:category});
    }else{
        allListings = await Listing.find({});
    }
    res.render("./listings/index.ejs",{allListings});
}

module.exports.renderNewForm =(req,res)=>{
    res.render("./listings/new.ejs");
};

module.exports.createListings=async(req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    let listings= new Listing(req.body.listing);
    listings.image={url,filename};
    listings.owner=req.user._id;
    listings.category=req.body.listing.category
    await listings.save();
    req.flash("success","New Listing Created");
    res.redirect("./listings");
}

module.exports.showListings =async(req,res)=>{
    let {id}=req.params;
    let listings = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listings){
        req.flash("error","Listings does not exists");
        res.redirect("/listings");
    };
    res.render("./listings/show.ejs",{listings});
};

module.exports.renderUpdateform =async(req,res)=>{
    let {id}=req.params;
    let listings = await Listing.findById(id);
    let originalImageUrl=listings.image.url;
    originalImageUrl.replace("/upload","/upload/w_250");
    res.render("./listings/edit.ejs",{listings});
};

module.exports.updateListings=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file!="undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image={url,filename};
    await listing.save();

    }
    req.flash("success","Listings Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListings=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};