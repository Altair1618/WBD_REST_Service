import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { JWT_KEY } from '../config';

export const validateJWT = (req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req.headers.authorization;
    
    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'Token tidak ditemukan',
            data: null
        });
    }
    
    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_KEY);
        res.locals.user = decoded;
        
        next();
    } catch (error) {
        return res.status(401).json({
            status: 'error',
            message: 'Token tidak valid',
            data: null
        });
    }
}