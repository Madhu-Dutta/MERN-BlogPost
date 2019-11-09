//Add - Posts(form) , Like , comments (setup controllers and relations)

//Create/register users
const express = require('express');
const router = express.Router();
const{check, validationResult} = require('express-validator');
const auth = require('../../middleware/auth');

const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');

//@Route POST api/posts
//@Route GET api/posts
    // router.get('/', (req, res) => res.send('Post route'));
//@desc Create a Post
//@Access  Private
router.post('/', [auth, [
        check('text', 'Text is required').not().isEmpty()
    ]
], 
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        //get all user info by userid except password
        const user = await User.findById(req.user.id).select('-password')

        const newPost = new Post({
            text: req.body.text,
            name: req.body.name,
            avatar: req.body.avatar,
            user: req.body.id
        })

        const post = await newPost.save();

        res.json(post);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }   
})

//@Route GET api/posts
//@desc GET all Posts
//@Access  Private (Posts are not public- need to sign in to view posts)
router.get('/', auth, async(req, res) => {
    try {
        //newest posts first
        const posts = await Post.find().sort({date: -1});
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.send(500).send('Server error');
    }
})

//@Route GET api/posts/:id
//@desc GET Posts by id
//@Access  Private (Posts are not public- need to sign in to view posts)
router.get('/:id', auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        //If no post
        if(!post){
            return res.status(404).json({msg: 'Post not found'});
        }
        res.json(post);

    } catch (err) {
        console.error(err.message);
         //If post doesnot match the id
        if(err.kind === 'ObjectId'){
            return res.status(404).json({msg: 'Post not found'});
        }
        res.send(500).send('Server error');
    }
})

//@Route DELETE api/posts/:id
//@desc DELETE Posts by id
//@Access  Private (Posts are not public- need to sign in to view posts)
router.delete('/:id', auth, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
        //If no post
        if(!post){
            return res.status(404).json({msg: 'Post not found'});
        }
        
        //// Check user
        // if (post.user.toString() !== req.user.id) {
        //     return res.status(401).json({ msg: 'User not authorized' });
        // }
    
        await post.remove();
    
        res.json({ msg: 'Post removed' });
        } catch (err) {
            console.error(err.message);
    
            res.status(500).send('Server Error');
        }
  });

    //@Route PUT api/posts/like/:id
    //@desc Like a Post
    //@Access  Private (Posts are not public- need to sign in to view posts)
    router.put('/like/:id', auth, async (req, res) => {
        try {
          const post = await Post.findById(req.params.id);
      
          // Check if the post has already been liked
          if (
            post.likes.filter(like => like.user.toString() === req.user.id).length > 0
          ) {
            return res.status(400).json({ msg: 'Post already liked' });
          }
      
          post.likes.unshift({ user: req.user.id });
      
          await post.save();
      
          res.json(post.likes);
        } catch (err) {
          console.error(err.message);
          res.status(500).send('Server Error');
        }
    });

    //@Route PUT api/posts/unlike/:id
    //@desc UnLike a Post
    //@Access  Private (Posts are not public- need to sign in to view posts)
    router.put('/unlike/:id', auth, async (req, res) => {
        try {
          const post = await Post.findById(req.params.id);
      
          // Check if the post has already been liked
          if (
            post.likes.filter(like => like.user.toString() === req.user.id).length === 0
          ) {
            return res.status(400).json({ msg: 'Post has not yet been liked' });
          }
      
          //Get the removed index
          const removeIndex =  post.likes.map(like => like.user.toString()).indexOf(req.user.id);
          
          post.likes.splice(removeIndex, 1);

          await post.save();
      
          res.json(post.likes);
        } catch (err) {
          console.error(err.message);
          res.status(500).send('Server Error');
        }
    });
      
    //@Route POST api/posts/comment/:id   
    //@desc Comment on a Post
    //@Access  Private
        router.post('/comment/:id', [auth, [
            check('text', 'Text is required').not().isEmpty()
        ]
    ], 
    async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        //get all user info by userid except password
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);

        const newComment = {
            text: req.body.text,
            name: req.name,
            avatar: req.avatar,
            user: req.user.id
        };

        //Add new comment
        post.comments.unshift(newComment);

        await post.save();

        res.json(post.comments);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }   
})

//@Route DELETE api/posts/comment/:id /:comment_id
//@desc Delete a comment
//@Access  Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //Pull out a comment
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);

        //Comment exists
        if(!comment){
            return res.status(404).json({msg: 'comment doesnot exist'});
        }
        
        //check user
        if(comment.user.toString() !== req.user.id){
            return res.status(401).json({msg: 'user is not authorized'});
        }
        
        //Get the removed index
        const removeIndex =  post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);
          
        post.comments.splice(removeIndex, 1);

        await post.save();
    
        res.json(post.comments);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
}) 


module.exports = router;