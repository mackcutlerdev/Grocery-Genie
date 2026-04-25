const mongoose = require('mongoose');

// Created now so the model exists when we wire auth in Phase 3.
// The routes/auth.js file will use this.
const UserSchema = new mongoose.Schema(
{
    username:
    {
        type: String,
        required: [true, 'Username is required'],
        unique: true,       // no duplicate usernames
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username must be 30 characters or fewer'],
    },
    passwordHash:
    {
        type: String,
        required: [true, 'Password is required'],
    },
},
{
    timestamps: true,
});

module.exports = mongoose.model('User', UserSchema);