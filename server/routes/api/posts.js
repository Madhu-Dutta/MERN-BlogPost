//Add - Posts(form) , Like , comments

//Create/register users
const express = require('express');
const router = express.Router();

//@Route GET api/posts
//@desc Test Route
//@Access  Public (if needs authentication to access a route)

router.get('/', (req, res) => res.send('Post route'));

module.exports = router;