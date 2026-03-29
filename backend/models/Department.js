const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a department name'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    organization: {
        type: mongoose.Schema.ObjectId,
        ref: 'Organization',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent duplicate department names within the same organization
DepartmentSchema.index({ name: 1, organization: 1 }, { unique: true });

module.exports = mongoose.model('Department', DepartmentSchema);
