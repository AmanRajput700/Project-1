const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");

//for image and files
const multer = require('multer');
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage});



//INDEX Route
router.get("/",wrapAsync(listingController.index));

//NEW router
router.get("/new",isLoggedIn,listingController.renderNewForm);

//SHOW
router.get("/:id",wrapAsync(listingController.showListing));


//Create Route
router.post("/",isLoggedIn,upload.single("listing[image]"),wrapAsync(listingController.createListing));

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

//Update Route
router.put("/:id",isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing));

//DELETE
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

module.exports = router;