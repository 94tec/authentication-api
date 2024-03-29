// src/models/userModel.js

// Import necessary modules
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Define the user schema
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
      },
    middlename: {
        type: String,
    },
    lastname: {
        type: String,
        required: true,
      },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phonenumber: Number,
    id: Number,
    password: {
        type: String,
        required: true
    },
    // gender: {
    //     type: String,
    //     enum: ['male', 'female', 'other'] // Define allowed values for gender
    // },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'], // Define allowed values for role
        default: 'user' // Default role is 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    },{timestamps: true}
);
// Hash the user's password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});
// Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

userSchema.methods.generateJWT = function () {
    return jwt.sign({
        id: this._id,
        username: this.username,
        email: this.email
    }, process.env.JWT_SECRET, { expiresIn: '1h' });
};
// Create a User model from the schema
const User = mongoose.model('User', userSchema);

// Export the User model
// Export the User model using CommonJS syntax
module.exports = User;



