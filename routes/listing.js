const express = require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");

const listingController = require("../controllers/listings.js");

// Index Route
router.get("/",wrapAsync(listingController.index));

// New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

// Show Route 
router.get("/:id", wrapAsync(listingController.showListings));

// Create Route 
router.post("/",isLoggedIn,validateListing, wrapAsync(listingController.createListing));

// Edit Route
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

// Update Route 
router.put("/:id", isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));

//Delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListings));

module.exports= router