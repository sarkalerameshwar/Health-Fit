import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

    username:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
        minLength: 6,
    },
    otp:{
        type: String,
        default: null,
    },
    otpExpiry:{
        type: Date,
    },
    ifVerified:{
        type: Boolean,
        default: false,
    },
    resetPasswordOtp: {
        type: String,
    },        
    resetPasswordOtpExpiry: {
        type: Date,

    } ,   
    date:{
        type: Date,
        default: Date.now,
    },
})

export default mongoose.model('User', userSchema);