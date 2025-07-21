const Listing = require("../models/listing.js");

module.exports.index = async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}

module.exports.renderNewForm =(req,res)=>{
    res.render("./listings/new.ejs");
};

module.exports.createListings=async(req,res,next)=>{
    let listings= new Listing(req.body.listing);
    listings.owner=req.user._id;
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
    res.render("./listings/edit.ejs",{listings});
};

module.exports.updateListings=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listings Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListings=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};