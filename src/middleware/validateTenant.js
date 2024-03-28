// middlewares/validateTenant.js

const Tenant = require('../models/Tenant');

function validateTenant(req, res, next) {
    const requiredFields = ['firstName', 'middleName', 'lastName', 'idNumber', 'dateOfBirth', 'phoneNumber1', 'email', 'address', 'createdBy', 'lease'];

    // Check if all required fields are present in the request body
    const missingFields = requiredFields.filter(field => !(field in req.body));
    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }

    // Custom validation for the phoneNumber1 field
    const phoneRegex = /^[0-9]{10}$/; // Regular expression for 10-digit phone number
    if (!phoneRegex.test(req.body.phoneNumber1)) {
        return res.status(400).json({ error: 'Invalid phone number format for phoneNumber1' });
    }

    // Custom validation for the lease endDate field
    const { lease } = req.body;
    if (!lease.startDate) {
        return res.status(400).json({ error: 'Start date must be provided for lease' });
    }
    const endDate = new Date(lease.startDate);
    endDate.setDate(endDate.getDate() + 365); // Add 365 days
    if (!lease.endDate || lease.endDate <= lease.startDate || lease.endDate.getTime() !== endDate.getTime()) {
        return res.status(400).json({ error: 'Invalid end date for lease' });
    }

    // Custom validation for the idNumber field
    const { idNumber } = req.body;
    if (!/^[A-Za-z0-9]+$/.test(idNumber)) {
        return res.status(400).json({ error: 'ID number must contain only alphanumeric characters' });
    }

    // Check if the idNumber format is valid based on provided options (military ID or passport number)
    const isMilitaryID = /^M[0-9]{9}$/; // Regular expression for military ID format
    const isPassportNumber = /^[A-Za-z]{2}[0-9]{7}$/; // Regular expression for passport number format

    if (!(isMilitaryID.test(idNumber) || isPassportNumber.test(idNumber))) {
        return res.status(400).json({ error: 'Invalid ID number format' });
    }

    next(); // Proceed to the route handler if all required fields are present and all custom validations pass
}

module.exports = validateTenant;
