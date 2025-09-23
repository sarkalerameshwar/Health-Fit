import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const JWT_SECRET = process.env.ADMIN_JWT_SECRET;

    // Check if secret is set
    if (!JWT_SECRET) {
        return res.status(500).json({ success: false, message: 'Server configuration error' });
    }

    try {
        // Get plain token from headers
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(403).json({ success: false, message: 'No token provided' });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Attach decoded payload to request
        // req.user = decoded;

        // Optional: enforce admin role
        // if (decoded.role && decoded.role !== 'admin') {
        //     return res.status(403).json({ success: false, message: 'Admin access only' });
        // }

        next();
    } catch (err) {
        console.error("Token verification error:", err.message);
        return res.status(401).json({ success: false, message: 'Unauthorized or token expired' });
    }
};

export default verifyToken;
