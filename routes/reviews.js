const express = require('express');
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require('../schemas');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const Review = require('../models/review');
const Park = require('../models/park');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
        console.log(error)
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const park = await Park.findById(req.params.id);
    const review = new Review(req.body.review);
    park.reviews.push(review)
    await review.save();
    await park.save();
    req.flash('success', 'Created new review')
    res.redirect(`/parks/${park._id}`);
}))


router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Park.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/parks/${id}`);
}))

module.exports = router;