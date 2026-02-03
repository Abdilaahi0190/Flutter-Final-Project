const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Qeexitaanka qaabka macmiilka (User Schema)
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Fadlan ku dar magacaaga'],
    },
    email: {
        type: String,
        required: [true, 'Fadlan ku dar email-kaaga'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Fadlan ku dar email sax ah',
        ],
    },
    role: {
        type: String,
        enum: ['user', 'employer'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true, 'Fadlan ku dar password-kaaga'],
        minlength: 6,
        select: false, // Ha soo saarin password-ka marka macmiilka la raadinayo
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Intaan la keydin, password-ka halkan ayaa lagu xifdiyaa (Hashing)
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Samee Token-ka loo isticmaalo xaqiijinta (JWT)
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Hubi in password-ka uu macmiilku qoray uu la mid yahay kan keydsan
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
