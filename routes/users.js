const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync')


router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.flash('success', 'Welcome to TruePark!');
        res.redirect('/parks');
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/register')
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome back!')
    res.redirect('/parks')
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Good bye!')
    res.redirect('/parks');
})

module.exports = router;