import { AuthService } from '../services/auth.service.js';

const authService = new AuthService();

export const AuthController = {
    login: async (req, res, next) => {
        try {
            res.json(await authService.login(req.body));
        } catch (error) {
            next(error);
        }
    },
    getMyProfile: async (req, res, next) => {
        try {
            res.json(await authService.getMyProfile(req.user.id));
        } catch (error) {
            next(error);
        }
    },
    updateMyProfile: async (req, res, next) => {
        try {
            res.json(await authService.updateMyProfile(req.user.id, req.body));
        } catch (error) {
            next(error);
        }
    },
    logout: async (req, res, next) => {
        try {
            res.json(await authService.logout({
                token: req.authToken,
                userId: req.user.id,
                expiresAt: req.authExpiresAt
            }));
        } catch (error) {
            next(error);
        }
    }
};
