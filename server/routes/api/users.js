//Create/register users
const express = require('express');
const router = express.Router();
//Validation of routes - using express validator (need to install express-validator )
const {check, validationResult} = require('express-validator/check');

//@Route GET api/users - for testing ONLY
//@ROute POST api/users
//@desc Register User
//@Access  Public/Private (if needs authentication to access a route)

// router.get('/', (req, res) => res.send('User route'));

//POST
router.post('/', [
    check('name', 'Name is required')
    .not()
    .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters')
    .isLength({min: 6})
], (req, res) => {
    // console.log(req.body);
    //CHECK FOR ERRORS
    const errors = validationResult(req);
    //If there is any error, send bad req msg
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    res.send('User route');
});


module.exports = router;