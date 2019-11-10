//authenticate users

//Create/register users
const express = require('express');
const router = express.Router();
//Use bcrypt's compare method to check if the entered password === encrypted password
const bcrypt = require('bcryptjs');
//bring auth middleware to authenticate users
const auth = require('../../middleware/auth');
//Get User model
const User = require('../../models/User');
//Validation of routes - using express validator (need to install express-validator )
const {check, validationResult} = require('express-validator');
//Bring jwt package for auth
const jwt = require('jsonwebtoken');
//Get the secret token from config files
const config = require('config');

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

//@ROute POST api/auth
//@desc Authenticate User and get token
//@Access  Public

//POST
router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required')
    .exists()
], async (req, res) => {
    // console.log(req.body);
    //CHECK FOR ERRORS
    const errors = validationResult(req);
    //If there is any error, send bad req msg
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    //Pull out the fields from req body
    const {email, password} = req.body;

    try{
    //check for a user
    let user = await User.findOne({email});   

    //check if not a user
    if(!user){ 
        return res.status(400).json({errors: [{msg: 'Invalid credentials'}] });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    //If no match is found between entered string password and user's encrypted password, return error
    if(!isMatch){
        return res.status(400).json({errors: [{msg: 'Invalid credentials'}] });
    }

    //return jsonwebtoken(for login)
    const payload = {
        //get id of the saved user
        user: {
            id: user.id
        }
    };
    //Use the secret token from config to signing in
    jwt.sign(
        payload,
        config.get('jwtSecret'),
        {expiresIn: 360000},
        (err,token) => {
            if(err) throw err;
            res.json({token});
        }
    )

    //Testing the test GET & POST route
    //res.send('User route');
    // res.send('User registered');

    }
    catch(error){
        console.error(error.message);
        return res.status(500).send('Server error');
    }
});

module.exports = router;