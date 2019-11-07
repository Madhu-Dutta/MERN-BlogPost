//Profile - Add , update , delete

//Create/register users
const express = require('express');
const router = express.Router();

//@Route GET api/profile
//@desc Test Route
//@Access  Public/Private (if needs authentication to access a route)

router.get('/', (req, res) => res.send('Profile route'));

module.exports = router;