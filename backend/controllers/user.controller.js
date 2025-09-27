import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/email.js';
import User from '../models/user.model.js';


const signup = async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    // Check if user exists and is already verified
    let existingUser = await User.findOne({ email });
    if (existingUser && existingUser.ifVerified) {
      return res.status(400).json({ message: 'User already exists and verified' });
    }

    // If user exists but not verified, allow resending OTP
    if (existingUser && !existingUser.ifVerified) {
      // Generate new OTP
      const newOtp = crypto.randomInt(100000, 999999).toString();
      
      // Update user with new OTP
      existingUser.otp = newOtp;
      existingUser.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
      await existingUser.save();

      try {
        await sendEmail(
          email,
          "Your HealthFit OTP Verification Code",
          `HEALTHFIT - ACCOUNT VERIFICATION

Hello ${username}!

Your new OTP verification code has been generated.

OTP: ${newOtp}

This OTP is valid for the next 10 minutes. Please do not share this code with anyone.

If you didn't request this verification, please ignore this email.

Stay healthy!
The HealthFit Team

---
© 2024 HealthFit. All rights reserved.
This is an automated message, please do not reply to this email.`
        );
        return res.status(200).json({ message: 'New OTP sent to your email. Please verify.' });
      } catch (emailError) {
        // console.error("Email sending failed:", emailError);
        return res.status(500).json({ message: 'Failed to send OTP email. Please try again.' });
      }
    }

    // New user registration
    const hashedPassword = await bcrypt.hash(password, 12);
    const otp = crypto.randomInt(100000, 999999).toString();

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      otp: otp,
      otpExpiry: Date.now() + 10 * 60 * 1000,
      ifVerified: false
    });

    await newUser.save();

    try {
      await sendEmail(
        email,
        "Your HealthFit OTP Verification Code",
        `HEALTHFIT - ACCOUNT VERIFICATION

Hello ${username}!

Welcome to HealthFit! We received a request to verify your account. 
Please use the following One-Time Password (OTP) to complete your verification:

OTP: ${otp}

This OTP is valid for the next 10 minutes. Please do not share this code with anyone.

If you didn't request this verification, please ignore this email.

Stay healthy!
The HealthFit Team

---
© 2024 HealthFit. All rights reserved.
This is an automated message, please do not reply to this email.`
      );
      res.status(201).json({ message: 'User registered. Please verify OTP sent to your email.' });
    } catch (emailError) {
      // console.error("Email sending failed:", emailError);
      res.status(500).json({ message: 'User registered, but failed to send OTP email. Please try again.' });
    }
  } catch (error) {
    // console.error("Signup error:", error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};


const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  console.log("OTP Verification Attempt:", { email, receivedOtp: otp });
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      // console.log("User not found for email:", email);
      return res.status(404).json({ message: 'User not found' });
    }


    // Trim whitespace from the received OTP
    const trimmedOtp = otp.trim();
    // console.log("Trimmed OTP:", trimmedOtp);

    if (user.otp !== trimmedOtp) {
      // console.log("OTP mismatch - Stored:", user.otp, "Received (trimmed):", trimmedOtp);
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.otpExpiry < Date.now()) {
      // console.log("OTP expired - Expiry:", user.otpExpiry, "Current:", Date.now());
      return res.status(400).json({ message: 'OTP expired' });
    }

    user.ifVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ message: 'OTP verified successfully', token, id:user._id });
  } catch (error) {
    // console.error("OTP verification error:", error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email' });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!existingUser.ifVerified) {
      return res.status(403).json({ message: 'Please verify your email first' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// auth.controller.js - Add these functions
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    
    // Save OTP to user document
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    try {
      await sendEmail(
        email,
        "HealthFit - Password Reset OTP",
        `HEALTHFIT - PASSWORD RESET

Hello ${user.username}!

We received a request to reset your password. 
Please use the following One-Time Password (OTP) to reset your password:

OTP: ${otp}

This OTP is valid for the next 10 minutes. Please do not share this code with anyone.

If you didn't request this password reset, please ignore this email or contact our support team immediately.

Stay healthy!
The HealthFit Team

---
© 2024 HealthFit. All rights reserved.
This is an automated message, please do not reply to this email.`
      );
      res.status(200).json({ message: 'Password reset OTP sent to your email' });
    } catch (emailError) {
      // console.error("Email sending failed:", emailError);
      res.status(500).json({ message: 'Failed to send OTP email. Please try again.' });
    }
  } catch (error) {
    // console.error("Forgot password error:", error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const verifyResetPasswordOtp = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Trim whitespace from OTP
    const trimmedOtp = otp.trim();

    // Verify OTP
    if (user.resetPasswordOtp !== trimmedOtp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check if OTP expired
    if (user.resetPasswordOtpExpiry < Date.now()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update password and clear OTP fields
    user.password = hashedPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully', id:user._id });
  } catch (error) {
    // console.error("Reset password error:", error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const resendResetPasswordOtp = async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate new OTP
    const newOtp = crypto.randomInt(100000, 999999).toString();
    
    // Update OTP fields
    user.resetPasswordOtp = newOtp;
    user.resetPasswordOtpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    try {
      await sendEmail(
        email,
        "HealthFit - New Password Reset OTP",
        `HEALTHFIT - PASSWORD RESET

Hello ${user.username}!

Your new password reset OTP has been generated.

OTP: ${newOtp}

This OTP is valid for the next 10 minutes. Please do not share this code with anyone.

If you didn't request this password reset, please ignore this email.

Stay healthy!
The HealthFit Team

---
© 2024 HealthFit. All rights reserved.
This is an automated message, please do not reply to this email.`
      );
      res.status(200).json({ message: 'New OTP sent to your email' });
    } catch (emailError) {
      // console.error("Email sending failed:", emailError);
      res.status(500).json({ message: 'Failed to send OTP email. Please try again.' });
    }
  } catch (error) {
    // console.error("Resend OTP error:", error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -otp -otpExpiry -resetPasswordOtp -resetPasswordOtpExpiry');
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    // console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong'
    });
  }
}

const getUserById = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming req.user is set by auth middleware
    const user = await User.findById(userId).select('-password -otp -otpExpiry -resetPasswordOtp -resetPasswordOtpExpiry'); // Exclude sensitive fields

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    } 
    res.status(200).json({ user });
  } catch (error) {

    // console.error("Get user by ID error:", error);

    res.status(500).json({ message: 'Something went wrong' });
  }
}

export { signup, verifyOtp, login, forgotPassword, verifyResetPasswordOtp, resendResetPasswordOtp, getAllUsers, getUserById };
