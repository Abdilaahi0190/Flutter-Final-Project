const mongoose = require('mongoose');

// Qaabka shaqada (Job Schema)
const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Fadlan ku dar cinwaanka shaqada'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Fadlan ku dar sharraxaadda shaqada'],
    },
    company: {
        type: String,
        required: [true, 'Fadlan ku dar magaca shirkadda'],
    },
    location: {
        type: String,
        required: [true, 'Fadlan ku dar goobta shaqadu tahay'],
    },
    salary: {
        type: String,
        required: [true, 'Fadlan ku dar mushaharka shaqada'],
    },
    jobType: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
        default: 'Full-time',
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User', // Waxay ku xidhan tahay macmiilkii soo dhigay (Employer)
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Job', JobSchema);
