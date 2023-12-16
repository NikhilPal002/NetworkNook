import jwt from "jsonwebtoken";
import { errorHandler } from './error.js'

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.access_token;

        if(!token) {
        return res.status(403).send("Access Denied");
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, verified) => {
            if (err) {
                return next(errorHandler(403, 'Forbidden'));
            }
            req.user = verified;
            next();
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};