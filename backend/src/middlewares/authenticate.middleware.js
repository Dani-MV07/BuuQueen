import AppError from '../utils/app-error.js';
import { RevokeTokenRepository } from '../repositories/revoke-token.repository.js';
import { hashJwt, verifyJwt } from '../utils/jwt.util.js';

const revokeTokenRepository = new RevokeTokenRepository();

export const authenticate = async (req, res, next) => {
    const authorization = req.get('authorization');
    const match = authorization?.match(/^Bearer\s+(.+)$/i);
    if (!match) {
        return next(new AppError('Se requiere un token Bearer.', 401));
    }

    let payload;
    try {
        payload = verifyJwt(match[1]);
    } catch (error) {
        if (error.statusCode) {
            return next(error);
        }
        return next(new AppError('El token es inválido o ha expirado.', 401));
    }

    if (!payload || typeof payload !== 'object' || typeof payload.sub !== 'string') {
        return next(new AppError('El token no contiene una identidad válida.', 401));
    }

    try {
        if (await revokeTokenRepository.isRevoked(hashJwt(match[1]))) {
            return next(new AppError('La sesión ha sido cerrada.', 401));
        }

        req.user = {
            id: payload.sub,
            role_id: payload.role_id,
            role: payload.role
        };
        req.authToken = match[1];
        req.authExpiresAt = payload.exp;
        return next();
    } catch (error) {
        return next(error);
    }
};