"use strict";

const express = require("express");
const router = express.Router();

// Controllers
const { createProfile, getProfile } = require("../controllers/profileController");
const { createUser, getUser } = require("../controllers/userController");
const { createComment, getComments, sortComments, toggleLike } = require("../controllers/commentController");


module.exports = function (Profile, User) {
  // GET route to retrieve profile by ID
  router.get("/profiles/:profileId", getProfile);

  // POST route to create a new profile
  router.post("/profiles", createProfile );

  // create user
  router.post("/users", createUser);

  // get users
  router.get("/users/:userId", getUser);

  // create comment using profile id
  router.post("/:profileId/comments", createComment);

  // get all comments, Filter comments based on query parameters
  router.get("/:profileId/comments", getComments);

  // sorting recent and best comments
  router.get("/:profileId/comments/sorting", sortComments);

  // like and dislike
  router.get("/:profileId/comments/:commentId/toggleLike/:userId", toggleLike);

  return router;
};
