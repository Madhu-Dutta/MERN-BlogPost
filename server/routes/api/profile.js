//Profile - Add , update , delete

//Create/register users
const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');

const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

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

//@Route DELETE api/profile/user/:user_id
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

module.exports = router;