import AppError from '../utils/app-error.js';

export const authorizeRoles = (...allowedRoles) => (req, res, next) => {
    if (!req.user) {
        return next(new AppError('Se requiere autenticación.', 401));
    }

    const userRoles = [req.user.role, req.user.role_id].filter(Boolean).map(String);
    if (!allowedRoles.some((role) => userRoles.includes(String(role)))) {
        return next(new AppError('No tienes permisos para realizar esta acción.', 403));
    }

    return next();
};