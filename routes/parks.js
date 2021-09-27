const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { parkSchema, reviewSchema } = require('../schemas')
const Park = require('../models/park');
const ExpressError = require('../utils/ExpressError');
const Review = require('../models/review');
const { isLoggedIn } = require('../middleware')

const validatePark = (req, res, next) => {
    const { error } = parkSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const parks = await Park.find({});
    res.render('parks/index.ejs', { parks });
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('parks/new.ejs');
})

router.post('/', isLoggedIn, validatePark, catchAsync(async (req, res, next) => {
    const park = new Park(req.body.park);
    await park.save();
    req.flash('success', 'Successfully made a new park');
    res.redirect(`/parks/${park.id}`);
}))

router.get('/:id', catchAsync(async (req, res) => {
    const park = await Park.findById(req.params.id).populate('reviews');
    if (!park) {
        req.flash('error', 'Cannot find that park!')
        res.redirect('/parks')
    }
    res.render('parks/show.ejs', { park });
}))


router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const park = await Park.findById(req.params.id);
    res.render('parks/edit.ejs', { park });
}))

router.put('/:id', isLoggedIn, validatePark, catchAsync(async (req, res) => {
    const park = await Park.findByIdAndUpdate(req.params.id, req.body.park);
    if (!park) {
        req.flash('error', 'Cannot find that park!')
        res.redirect('/parks')
    }
    req.flash('success', 'Successfully updated park')
    res.redirect(`/parks/${park._id}`);
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const park = await Park.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted park')
    res.redirect('/parks');
}))

module.exports = router;