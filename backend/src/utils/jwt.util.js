import jwt from 'jsonwebtoken';
import AppError from './app-error.js';

const getSecret = () => {
    if (!process.env.JWT_SECRET) {
        throw new AppError('El servidor no tiene configurado JWT_SECRET.', 500);
    }
    return process.env.JWT_SECRET;
};

export const signJwt = (payload, options = {}) => jwt.sign(payload, getSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    ...options
});

export const verifyJwt = (token) => jwt.verify(token, getSecret());