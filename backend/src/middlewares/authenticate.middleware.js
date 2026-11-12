import AppError from '../utils/app-error.js';
import { verifyJwt } from '../utils/jwt.util.js';

export const authenticate = (req, res, next) => {
    const authorization = req.get('authorization');
    const match = authorization?.match(/^Bearer\s+(.+)$/i);
    if (!match) {
        return next(new AppError('Se requiere un token Bearer.', 401));
    }

    try {
        const payload = verifyJwt(match[1]);
        if (!payload || typeof payload !== 'object' || typeof payload.sub !== 'string') {
            return next(new AppError('El token no contiene una identidad válida.', 401));
        }

        req.user = {
            id: payload.sub,
            role_id: payload.role_id,
            role: payload.role
        };
        return next();
    } catch (error) {
        if (error.statusCode) {
            return next(error);
        }
        return next(new AppError('El token es inválido o ha expirado.', 401));
    }
};