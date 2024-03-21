'use strict';

const express = require('express');
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

module.exports = function (Profile) {
  // GET route to retrieve profile by ID
  router.get('/:id', async function (req, res, next) {
    console.log(req.params.id);
    try {
      const profile = await Profile.findById(req.params.id);
      console.log(profile);
      if (!profile) {
        return res.status(404).send('Profile not found');
      }
      res.send(profile);
    } catch (error) {
      next(error);
    }
  });

  // POST route to create a new profile
  router.post('/', async function (req, res, next) {
    console.log(req.body);
    try {
      const profile = new Profile(req.body);
      console.log(profile);
      await profile.save();
      res.status(201).send(profile);
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
        personalitySystem: req.body.personalitySystem
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



  router.get('/:profileId/comments-sorting', async (req, res, next) => {
    try {
      const profile = await Profile.findById(req.params.profileId);
      if (!profile) {
        return res.status(404).send('Profile not found');
      }

      // Sort comments by createdAt in descending order to get most recent comments first
      profile.comments.sort((a, b) => {
        return b.createdAt - a.createdAt;
      });

      res.json(profile.comments);
    } catch (error) {
      next(error);
    }
  });


  router.post('/:profileId/comments/:commentId/like', async (req, res, next) => {
    try {
      const profile = await Profile.findById(req.params.profileId);
      if (!profile) {
        return res.status(404).send('Profile not found');
      }

      const comment = profile.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).send('Comment not found');
      }

      comment.likes += 1;
      await profile.save();

      res.json(comment);
    } catch (error) {
      next(error);
    }
  });


  return router;
};

