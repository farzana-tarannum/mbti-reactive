const errorMessages = require("../configs/constant");
const User = require("../models/user.model");
const validateObjectId = require("../validator/objectValidator");


const createUser = async (req, res, next) => {
    try {
        const { name } = req.body;
        console.log("=> requested name: " + name);
        const user = new User({ name });
        await user.save();
        console.log(user);

        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
}

const getUser = async (req, res, next) => {
    let userId = req.params.userId;
    console.log("=> requested userId: " + userId);
    if (!validateObjectId(userId)) {
      return res.status(400).send(errorMessages.INVALID_USER_ID);
    }
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send(errorMessages.USER_NOT_FOUND);
      }

      res.send(user);
    } catch (error) {
      next(error);
    }
  }

module.exports = {
    createUser,
    getUser
};