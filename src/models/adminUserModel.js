// src/models/adminUserModel.js

// Import necessary modules
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Define the admin user schema
const adminUserSchema = new mongoose.Schema({
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
    role: {
        type: String,
        enum: ['admin', 'user'], // Define allowed values for role
        default: 'user' // Default role is 'user'
    },
    // Add or modify fields as necessary for your admin user requirements
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {timestamps: true});

// Hash the admin user's password before saving
adminUserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords for admin user
adminUserSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

// Generate JWT for admin user
adminUserSchema.methods.generateJWT = function () {
    return jwt.sign({
        id: this._id,
        username: this.username,
        email: this.email
    }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Create an AdminUser model from the schema
const AdminUser = mongoose.model('AdminUser', adminUserSchema);

// Export the AdminUser model
module.exports = AdminUser;
