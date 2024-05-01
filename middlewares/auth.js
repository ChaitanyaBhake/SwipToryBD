const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.auth = (req, res, next) => {
    
    // Check authorization header
    if (req.headers.authorization) {
        const authHeader = req.headers.authorization;
        // Extract token from "Bearer <token>" format
        token = authHeader.replace('Bearer ', '');
    } else if (req.cookies.token) {
        // Check cookie
        token = req.cookies.token;
    } else if (req.body.token) {
        // Check request body
        token = req.body.token;
    }

    //if token is missing return no response
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token is missing',
        });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        // If token verification Fails
        if (error) {
            req.user = null;
            return res.status(403).json('Token is not valid!');
        }
        //Store decoded user data in request object
        req.user = user;

        //Proceed to Next middleware
        next();
    });
};
