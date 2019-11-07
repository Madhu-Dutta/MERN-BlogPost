//authenticate users

//Create/register users
const express = require('express');
const router = express.Router();

//@Route GET api/auth
//@desc Test Route
//@Access  Public/Private (if needs authentication to access a route)

router.get('/', (req, res) => res.send('Auth route'));

module.exports = router;