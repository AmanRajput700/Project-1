const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js") 
const {reviewSchema} = require("../schema.js");
const {validateReview} = require("../middleware.js");

//REVIEWS
router.post("/",validateReview,wrapAsync(async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${listing._id}`);
}))

//DELETE REVIEW ROUTE
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let{id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull :{reviews : reviewId}}) //Deleteing object id in reviews array in Listing Collection
    await Review.findByIdAndDelete(reviewId); //Deleting review from review collection
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
}))

module.exports = router;