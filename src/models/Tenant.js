// models/Tenant.js

const mongoose = require('mongoose');
const User = require('./Users');

const leaseSchema = new mongoose.Schema({
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    rentAmount: {
        type: Number,
        required: true
    },
    depositAmount: {
        type: Number,
        required: true
    }
});

const tenantSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    middleName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    idNumber: {
        type: String,
        required: true,
        unique: true // Ensures each ID number is unique
    },
    dateOfBirth: {
        type: Date,
        required: true
    },    
    phoneNumber1: {
        type: String,
        required: true
    },
    phoneNumber2: {
        type: String
    },
    emergencyContact: {
        name: String,
        relationship: String,
        phoneNumber: String
    },    
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String
    },    
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User, // Reference to the User model
        required: true,
        unique: true // Ensures each tenant is created by only one user
    },
    lease: {
        type: leaseSchema,
        required: true
    }
});

const Tenant = mongoose.model('Tenant', tenantSchema);

module.exports = Tenant;

