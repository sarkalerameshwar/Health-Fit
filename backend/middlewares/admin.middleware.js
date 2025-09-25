import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    // Try different environment variable names
    const JWT_SECRET = process.env.ADMIN_JWT_SECRET

    try {
        // Get token from headers
        let token = req.headers['authorization'] || 
                   req.headers['x-access-token'] || 
                   req.headers['token'];

        if (!token) {
            return res.status(403).json({ 
                success: false, 
                message: 'No token provided' 
            });
        }

        // Clean the token
        token = token.trim();
        
        // Remove "Bearer " if present (even though you're using plain tokens)
        if (token.startsWith('Bearer ')) {
            token = token.slice(7);
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();

    } catch (err) {
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid token signature',
            error: 'The token was signed with a different secret key'
        });
    }
};
const admin = verifyToken;

export default admin;