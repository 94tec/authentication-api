// models/Tenant.js

const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    }
});

const Tenant = mongoose.model('Tenant', tenantSchema);

module.exports = Tenant;
