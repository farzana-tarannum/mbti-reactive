const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: String,
    user: String, 
    likes: { type: Number, default: 0 },
    personalitySystem: String,
    createdAt: { type: Date, default: Date.now } 
});

// Set up mongoose models and schema
const profileSchema = new mongoose.Schema({
    name: String,
    description: String,
    mbti: String,
    enneagram: String,
    variant: String,
    tritype: Number,
    socionics: String,
    sloan: String,
    psyche: String,
    image: String,
    comments: [commentSchema],
});

// Define the model
const Profile = mongoose.model('Profile', profileSchema);

// Export the model
module.exports = Profile;