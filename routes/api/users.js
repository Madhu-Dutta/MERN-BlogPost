//Create/register users
const express = require('express');
const router = express.Router();
//Validation of routes - using express validator (need to install express-validator )
const {check, validationResult} = require('express-validator');
//Get user model
const User = require('../../models/User');
//Use gravatar package
const gravatar = require('gravatar');
//Bring bcrypt for hashing and salting password
const bcrypt = require('bcryptjs');
//Bring jwt package for auth
const jwt = require('jsonwebtoken');
//Get the secret token from config files
const config = require('config');


//@Route GET api/users - for testing ONLY
    //router.get('/', (req, res) => res.send('User route'));

//@ROute POST api/users
//@desc Register User
//@Access  Public/Private (if needs authentication to access a route)

//POST
router.post('/', [
    check('name', 'Name is required')
    .not()
    .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters')
    .isLength({min: 6})
], async (req, res) => {
    // console.log(req.body);
    //CHECK FOR ERRORS
    const errors = validationResult(req);
    //If there is any error, send bad req msg
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    //Pull out the fields from req body
    const {name, email, password} = req.body;

    try{
    //check for a user
    let user = await User.findOne({email});   

    //see if user exists
    if(user){ 
        return res.status(400).json({errors: [{msg: 'User already exists'}] });
    }

    //Get users avatar
    const avatar = gravatar.url(email, {
        //gravatar omg settings
        s: '200',
        r: 'pg',
        d: 'mm'
    })
    //Create a new user and register in db
    user = new User({
        name,
        email,
        avatar,
        password
    })

    //Encrypt password
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

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
        {expiresIn: 3600},
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