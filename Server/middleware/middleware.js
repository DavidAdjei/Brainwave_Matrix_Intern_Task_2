import jwt from 'jsonwebtoken';
import BlacklistedToken from '../Models/BlackListedTokens.js';

export const auth = async (req, res, next) => {
    try {
        // Check if Authorization header exists
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header missing' });
        }

        // Extract and clean the token
        const token = authHeader.replace('Bearer ', '').trim();
        if (!token) {
            return res.status(401).json({ error: 'Token is missing' });
        }

        // Check if the token is blacklisted
        const blacklistedToken = await BlacklistedToken.findOne({ token });
        if (blacklistedToken) {
            return res.status(403).json({ error: 'Token is blacklisted' });
        }

        // Verify the token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        const userId = decoded.id;
        if (!userId) {
            return res.status(400).json({ error: 'Invalid token payload: Missing user ID' });
        }

        req.userId = userId;

        next();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
