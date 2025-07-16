import jwt, { Secret } from "jsonwebtoken";
import express from "express";

declare global {
    namespace Express {
        interface Request {
            user?: {
                username: string;
                iat: number;
            };
        }
    }
}

function authenticateToken(req: express.Request, res: express.Response, next: express.NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
        console.log('No token provided');
        return res.status(401).send('No token provided');
    }

    console.log('url', req.url);

    try {
        const payload = jwt.verify(token as string, process.env.SECRET_KEY as Secret) as { username: string, iat: number };

        // ✅ Safe: assign to custom req.user property
        req.user = { username: payload.username, iat: payload.iat };

        console.log('verified token', payload);
        next();
    } catch (err) {
        console.log('Invalid token', err);
        res.status(401).send('Invalid token');
    }
}

export default authenticateToken;
