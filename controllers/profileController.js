const errorMessages = require("../configs/constant");
const Profile = require("../models/profileModel");
const validateObjectId = require("../validator/objectValidator");


const createProfile = async (req, res, next) => {

    console.log(`=> requested body: ${new Profile(req.body)}`);
    try {
        const profile = new Profile(req.body);
        console.log("=> retrieved profile data: " + profile);
        await profile.save();
        res.status(201).send(profile);
    } catch (error) {
        next(error);
    }
}


const getProfile = async (req, res, next) => {

    const profileId = req.params.profileId;
    console.log("=> requested profileId: " + profileId);

    if (!validateObjectId(profileId)) {
        return res.status(400).send(errorMessages.INVALID_PROFILE_ID);
    }

    try {
        const profile = await Profile.findById(profileId);
        console.log(profile);
        if (!profile) {
            return res.status(404).send(errorMessages.PROFILE_NOT_FOUND);
        }
        res.render("profile_template", { profile });
    } catch (error) {
        next(error);
    }

}

module.exports = {
    createProfile,
    getProfile
};