import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiError.js';

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return next(new ApiError(401, "Authorization token is required"));
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userId = decoded._id; // Correctly set userId from the decoded token
        next();
    } catch (error) {
        return next(new ApiError(403, "Invalid or expired token"));
    }
};

export { authMiddleware };

