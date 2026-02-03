const mongoose = require('mongoose');

// Qaabka codsiga shaqada (Application Schema)
const ApplicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.ObjectId,
        ref: 'Job',
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Interview', 'Accepted', 'Rejected'],
        default: 'Pending',
    },
    resumeUrl: {
        type: String,
        required: [true, 'Fadlan ku dar URL-ka CV-gaaga'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Isticmaal pre-hook si loo xaqiijiyo in macmiilku uusan laba jeer codsan hal shaqo
ApplicationSchema.index({ job: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
