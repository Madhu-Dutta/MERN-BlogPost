//Profile - Add , update , delete

//Create/register users
const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const request = require('request');

const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const config = require('config');

//@Route GET api/profile/me
//@desc Test Route
    //router.get('/', (req, res) => res.send('Profile route'));
//@desc Get current user profile
//@Access Private

// Get the protected route
router.get('/me', auth, async(req, res) => {
    try{
        //find the profile based on user id(profile model user object contains the user id)
        const profile = await Profile.findOne({ user: req.user.id}).populate('user',
        ['name', 'avatar']
    );
    //If no profile matches user id
        if(!profile){
            return res.status(400).json({msg : 'There is no profile for user'})
        }
        res.json(profile);
    }
    catch(err){
        console.error(err.message);
        return res.status(500).send('Server error');
    }
})

//@Route POST api/profile
//@desc Create / Update user profile
//@Access Private

router.post('/', 
[
    auth,
    [
    check('status', 'Status is required')
        .not()
        .isEmpty(),
    check('skills', 'skills is required')
        .not()
        .isEmpty()
    ]
], 
    async (req, res) => {
        const errors = validationResult(req);
        //Check for error - if error exists
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        //Pulling all the fields from the profile req body
        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
          } = req.body;

          //Check all the fields are added before trying to submit to database
          //Build profile object
          const profileFields = {};
          //Add all fields to profileField Object
          profileFields.user = req.user.id;
          if(company) profileFields.company =  company;
          if(website) profileFields.website =  website;
          if(location) profileFields.location =  location;
          if(bio) profileFields.bio =  bio;
          if(status) profileFields.status =  status;
          if(githubusername) profileFields.githubusername =  githubusername;
          //skills needed to be turned from comma separated list to array
          if(skills) {
              //split turns list to array
              profileFields.skills = skills.split(',').map(skill => skill.trim())
          }
          console.log(profileFields.skill);

          //build social object
          profileFields.social = {}
          if(youtube) profileFields.social.youtube =  youtube;
          if(twitter) profileFields.social.twitter =  twitter;
          if(facebook) profileFields.social.facebook =  facebook;
          if(linkedin) profileFields.social.linkedin =  linkedin;
          if(instagram) profileFields.social.instagram =  instagram;

          try{
            let profile = await Profile.findOne({user: req.user.id});
            //If a profile is found update the profile
            if(profile) {
                //update
                profile = await Profile.findOneAndUpdate(
                    {user: req.user.id},
                    {$set: profileFields},
                    {new: true}
                );
                return res.json(profile);
            } 
                //If no profile found
                //Create a Profile
                profile = new Profile(profileFields);

                await profile.save();

                res.json(profile);
        }
        catch(err){
            console.error(err.message);
            return res.status(500).send('Server error');
        }   
    }
)

//@Route Get api/profile
//@desc Get all profiles
//@Access Public

router.get('/', async(req, res) => {
    try {
        //Populate profile from user collection with array fields name and avatar
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        //send the profile info as json objects
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

//@Route Get api/profile/user/:user_id
//@desc Get profile by user_id
//@Access Public

router.get('/user/:user_id', async(req, res) => {
    try {
        //Populate profile from user, using user_id (findOne with matching id params) 
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar']);

        //Check if there is a profile 
        if(!profile){
            return res.status(400).json({msg: 'Profile not found'});
        }

        //send the profile info as json objects
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        //If the objectId is not valid
        if(err.kind === "ObjectId"){
            return res.status(400).json({msg: 'Profile not found'});
        }
        res.status(500).send('Server error');
    }
})

//@Route DELETE api/profile
//@desc DELETE profile, user and posts
//@Access Private

router.delete('/', auth, async(req, res) => {
    try {
        //@todo - remove posts

        //Remove Profile
        await Profile.findOneAndRemove({user: req.user.id});

        //Remove User
        await User.findOneAndRemove({_id: req.user.id});

        //send the profile info as json objects
        res.json({msg: 'User deleted'});

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

//@Route PUT api/profile/experience
//@desc Update profile with Experience Object   
//@Access Private

//Profile experience will need some validation checks. Frontend will use this fields to enter user's data via form
router.put('/experience', [auth , [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
]] , async (req, res) => {
    const errors = validationResult(req);
    //check for errors
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    //Pull req body data
    const{
        title,
        company,
        location,
        to,
        from,
        current,
        description
    } = req.body;

    //Create data from what user submits
    const newExp = {
        title,
        company,
        location,
        to,
        from,
        current,
        description
    }

    try{
        //user : req.user.id as we are using protected/private routes
        const profile = await Profile.findOne({user: req.user.id}); 
        //unshift to push at the end of array. Newest first
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
    }
    catch(err){
        console.error(err);
        res.status(500).send('Server error');
    }
})

//@Route DELETE api/profile/experience/:exp_id
//@desc Delete Experience from profile
//@Access Private

router.delete('/experience/:exp_id', auth, async(req, res) => {
    try {
        //Get the correct profile by user id
        const profile = await Profile.findOne({user: req.user.id}); 

        //Get the index of experience object
        const removeIndex = 
        profile.experience
        //Object id
        .map(item => item.id)
        //index matches the id
        .indexOf(req.params.exp_id)

        //remove the experience that matches the particular index and remove 1 element
        profile.experience.splice(removeIndex, 1);

        //save the updated profile
        await profile.save();

        //send back the res as json obj
        res.json(profile);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');  
    }
})

//@Route PUT api/profile/education
//@desc Update profile with Education Object   
//@Access Private

router.put('/education', [auth , [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
]] , async (req, res) => {
    const errors = validationResult(req);
    //check for errors
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    //Pull req body data
    const{
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    //Create data from what user submits
    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }

    try{
        //user : req.user.id as we are using protected/private routes
        const profile = await Profile.findOne({user: req.user.id}); 
        //unshift to push at the end of array. Newest first
        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile);
    }
    catch(err){
        console.error(err);
        res.status(500).send('Server error');
    }
})

//@Route DELETE api/profile/education/:edu_id
//@desc Delete Education from profile
//@Access Private

router.delete('/education/:edu_id', auth, async(req, res) => {
    try {
        //Get the correct profile by user id
        const profile = await Profile.findOne({user: req.user.id}); 

        //Get the index of education object
        const removeIndex = 
        profile.education
        //Object id
        .map(item => item.id)
        //index matches the id
        .indexOf(req.params.edu_id)

        //remove the education that matches the particular index and remove 1 element
        profile.education.splice(removeIndex, 1);

        //save the updated profile
        await profile.save();

        //send back the res as json obj
        res.json(profile);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');  
    }
})

//@Route GET api/profile/github/:username
//@desc Get user repos from github
//@Access Public
router.get('/github/:username', async (req, res) => {
    try {        
        //get users by username
        //limit 5 per page and sorted in order posts are created in asc order
        const options = {
            uri: encodeURI(`https://api.github.com/users/${
                req.params.username
            }/repos?per_page=5&sort=created:asc&client_id=${config.get(
                'githubClientId'
            )}&client_secret=${config.get('githubSecret')}`),
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
            };
        
        //request takes 2 parameters = option and a callback function with response, error and body
        request(options, (error, response, body) => {
            if(error) console.error(error);
            //if response is not 200(success) then send a 404(not found) 
            if(response.statusCode !== 200){
                res.status(404).json({msg: 'No github profile found'});
            }
            //response returns a json object
            res.json(JSON.parse(body));
        })
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
})

module.exports = router;