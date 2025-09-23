import express from 'express';
import jwt from 'jsonwebtoken';

// Login Controller
const login = (req, res) => {
    const { username, password } = req.body;

    const JWT_SECRET = process.env.ADMIN_JWT_SECRET;
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    // Check if required environment variables are set
    if (!JWT_SECRET || !ADMIN_USERNAME || !ADMIN_PASSWORD) {
        console.error("Missing required environment variables for admin authentication");
        return res.status(500).json({
            success: false,
            message: 'Server configuration error'
        });
    }

    // Check credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {

        // Payload for the token
        const payload = { username }; // You can also add roles or userId here

        // Generate JWT Token (expires in 1 hour)
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token
        });
    } else {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }
};

export { login };
