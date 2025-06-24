const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For hashing passwords
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    address: {
        type: String,
    },
    salary: {
        type: Number,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive',
    },


}, {
    timestamps: true  // This adds createdAt and updatedAt automatically
});

// ✅ Hash the password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Skip if password hasn't changed

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

//Compareing Password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};



// Generate JWT token
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id, phoneNumber: this.phoneNumber, role: this.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '12h' }
    );
    return token;
};


const User = mongoose.model('User', userSchema);

module.exports = User;