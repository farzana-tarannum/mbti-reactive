const errorMessages = require("../configs/constant");
const Profile = require("../models/profileModel");
const User = require("../models/user.model");
const validateObjectId = require("../validator/objectValidator");


const createComment = async (req, res, next) => {
    let profileId = req.params.profileId;
    console.log("=> requested profileId: " + profileId);
    if (!validateObjectId(profileId)) {
        return res.status(400).send(errorMessages.INVALID_PROFILE_ID);
    }
    try {
        const profile = await Profile.findById(req.params.profileId);
        if (!profile) {
            return res.status(404).send(errorMessages.PROFILE_NOT_FOUND);
        }

        const comment = {
            text: req.body.text,
            votes: req.body.votes, // Array of voting options [{ system: 'MBTI', values: ['value1', 'value2'] }, ...]
            user: req.body.user,
        };

        profile.comments.push(comment);
        await profile.save();

        res.status(201).json(comment);
    } catch (error) {
        next(error);
    }
}


const getComments = async (req, res, next) => {
    let profileId = req.params.profileId;
    console.log("=> requested profileId: " + profileId);
    if (!validateObjectId(profileId)) {
        return res.status(400).send(errorMessages.INVALID_PROFILE_ID);
    }
    try {
        const profile = await Profile.findById(req.params.profileId);
        if (!profile) {
            return res.status(404).send(errorMessages.PROFILE_NOT_FOUND);
        }

        const retrievedComments = profile.comments;
        let filteredComments;

        // Filter comments based on query parameters
        if (req.query.personalitySystem === "ALL") {
            filteredComments = retrievedComments;
            // filteredComments = retrievedComments.filter(
            //   (comment) => comment.personalitySystem === req.query.personalitySystem
            // );
        } else if (req.query.personalitySystem) {
            filteredComments = retrievedComments.filter((comment) => {
                return comment.votes.some(
                    (vote) => vote.system === req.query.personalitySystem
                );
            });
        }

        res.json(filteredComments);
    } catch (error) {
        next(error);
    }
}

const sortComments = async (req, res, next) => {
    let profileId = req.params.profileId;
    console.log("=> requested profileId: " + profileId);
    if (!validateObjectId(profileId)) {
        return res.status(400).send(errorMessages.INVALID_PROFILE_ID);
    }
    try {
        const profile = await Profile.findById(req.params.profileId);
        if (!profile) {
            return res.status(404).send(errorMessages.PROFILE_NOT_FOUND);
        }

        let comments = profile.comments;

        // Sort comments by createdAt in descending order to get most recent comments first
        if (req.query.sortBy === "recent") {
            comments.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
        }

        // Sort comments by number of likes if query parameter is provided
        if (req.query.sortBy === "best") {
            comments.sort((a, b) => {
                return b.likes.length - a.likes.length;
            });
        }

        res.json(comments);
    } catch (error) {
        next(error);
    }
}

const toggleLike = async (req, res, next) => {
    let profileId = req.params.profileId;
    console.log("=> requested profileId: " + profileId);
    if (!validateObjectId(profileId)) {
        return res.status(400).send(errorMessages.INVALID_PROFILE_ID);
    }
    let commentId = req.params.commentId;
    console.log("=> requested commentId: " + commentId);
    if (!validateObjectId(commentId)) {
        return res.status(400).send(errorMessages.INVALID_COMMENT_ID);
    }
    let userId = req.params.userId;
    console.log("=> requested userId: " + userId);
    if (!validateObjectId(userId)) {
        return res.status(400).send(errorMessages.INVALID_USER_ID);
    }
    try {
        const profile = await Profile.findById(profileId);
        if (!profile) {
            return res.status(404).send(errorMessages.PROFILE_NOT_FOUND);
        }

        const comment = profile.comments.id(commentId);
        if (!comment) {
            return res.status(404).send(errorMessages.COMMENT_NOT_FOUND);
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send(errorMessages.USER_NOT_FOUND);
        }

        const index = comment.likes.indexOf(userId);
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
}

module.exports = {
    createComment,
    getComments,
    sortComments,
    toggleLike
}