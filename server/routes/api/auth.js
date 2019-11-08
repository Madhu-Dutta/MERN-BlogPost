//authenticate users

//Create/register users
const express = require('express');
const router = express.Router();
//bring auth middleware to authenticate users
const auth = require('../../middleware/auth');
//Get User model
const User = require('../../models/User');

//@Route GET api/auth
//@desc Test Route
//@Access  Public/Private (if needs authentication to access a route)

// //test if the middleware is working
// router.get('/', auth, (req, res) => res.send('Auth route'));

//Return user info if auth is successful
router.get('/', auth, async(req, res) => {

    try{
        //Just return the id from user, not the password info
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }
    catch(err){
        console.error(err.message);
        return res.status(500).send('Server error');
    }

});

module.exports = router;