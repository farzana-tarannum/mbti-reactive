'use strict';

const express = require('express');
const User = require('../models/user.model');
const router = express.Router();

// const profiles = [
//   {
//     "id": 1,
//     "name": "A Martinez",
//     "description": "Adolph Larrue Martinez III.",
//     "mbti": "ISFJ",
//     "enneagram": "9w3",
//     "variant": "sp/so",
//     "tritype": 725,
//     "socionics": "SEE",
//     "sloan": "RCOEN",
//     "psyche": "FEVL",
//     "image": "https://soulverse.boo.world/images/1.png",
//   }
// ];

module.exports = function (Profile, User) {

  // GET route to retrieve profile by ID
  router.get('/profiles/:profileId', async function (req, res, next) {
    let profileId = new String(req.params.profileId)
    console.log('=> requested profileId: ' + profileId);
    try {
      const profile = await Profile.findById(profileId);
      console.log(profile);
      if (!profile) {
        return res.status(404).send('Profile not found');
      }
      res.render('profile_template', {profile});
    } catch (error) {
      next(error);
    }
  });

  // POST route to create a new profile
  router.post('/profiles', async function (req, res, next) {
    console.log(`=> requested body: ${new Profile(req.body)}`);
    try {
      const profile = new Profile(req.body);
      console.log('=> retrieved profile data: ' + profile);
      await profile.save();
      res.status(201).send(profile);
    } catch (error) {
      next(error);
    }
  });


    // create user
    router.post('/users', async function (req, res, next) {
      try {
        const { name } = req.body;
        console.log('=> requested name: ' + name);
        const user = new User({ name });    
        await user.save();
        console.log(user);
    
        res.status(201).json(user);
      } catch (error) {
        next(error);
      }
    });

    // get users
    router.get('/users/:userId', async function (req, res, next) {
      let userId = new String(req.params.userId)
      console.log('=> requested profileId: ' + userId);
      try {
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).send('User not found');
        }

        res.send(user)
      } catch (error) {
        next(error);
      }
    });

    router.post('/:profileId/comments', async (req, res, next) => {
      try {
        const profile = await Profile.findById(req.params.profileId);
        if (!profile) {
          return res.status(404).send('Profile not found');
        }
    
        const comment = {
          text: req.body.text,
          user: req.body.userName,
          personalitySystem: req.body.personalitySystem,
          votes: req.body.votes // Array of voting options [{ system: 'MBTI', values: ['value1', 'value2'] }, ...]
        };
    
        profile.comments.push(comment);
        await profile.save();
    
        res.status(201).json(comment);
      } catch (error) {
        next(error);
      }
    });

  router.get('/:profileId/comments', async (req, res, next) => {
    try {
      const profile = await Profile.findById(req.params.profileId);
      if (!profile) {
        return res.status(404).send('Profile not found');
      }

      let filteredComments = profile.comments;

      // Filter comments based on query parameters
      if (req.query.personalitySystem) {
        filteredComments = filteredComments.filter(comment => comment.personalitySystem === req.query.personalitySystem);
      }

      res.json(filteredComments);
    } catch (error) {
      next(error);
    }
  });



  router.get('/:profileId/comments/sorting', async (req, res, next) => {
    try {
      const profile = await Profile.findById(req.params.profileId);
      if (!profile) {
        return res.status(404).send('Profile not found');
      }
  
      let comments = profile.comments;
  
      // Sort comments by createdAt in descending order to get most recent comments first
      if (req.query.sortBy === 'recent') {
        comments.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
      }
  
      // Sort comments by number of likes if query parameter is provided
      if (req.query.sortBy === 'best') {
        comments.sort((a, b) => {
          return b.likes.length - a.likes.length;
        });
      }
  
      res.json(comments);
    } catch (error) {
      next(error);
    }
  });


  router.get('/:profileId/comments/:commentId/toggleLike/:userId', async (req, res, next) => {
    try {
      const profile = await Profile.findById(req.params.profileId);
      if (!profile) {
        return res.status(404).send('Profile not found');
      }
  
      const comment = profile.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).send('Comment not found');
      }
  
      const index = comment.likes.indexOf(req.params.userId);
      if (index === -1) {
        comment.likes.push(req.params.userId);
      } else {
        comment.likes.splice(index, 1);
      }
  
      await profile.save();
  
      res.status(200).send(profile);
    } catch (error) {
      next(error);
    }
  });
  


  return router;
};

