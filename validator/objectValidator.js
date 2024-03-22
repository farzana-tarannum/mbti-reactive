const mongoose = require("mongoose");

const validateObjectId = (objectId) => {
    // Validate provided ObjectId
    return mongoose.Types.ObjectId.isValid(objectId);
};

module.exports = validateObjectId;