const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js")
const multer  = require('multer');
const {storage} = require("../CloudConfig.js");
const upload = multer({ storage })


//Index Route and Create Route
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListings));
    

//New Route   
router.get("/new",isLoggedIn,listingController.renderNewForm);

//show route and update route and delete
router.route("/:id")
    .get(wrapAsync(listingController.showListings))
    .put(isLoggedIn,upload.single("listing[image]"),isOwner,validateListing,wrapAsync(listingController.updateListings))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListings));


//edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderUpdateform));


module.exports = router;