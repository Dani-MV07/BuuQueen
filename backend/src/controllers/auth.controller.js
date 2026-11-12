import { AuthService } from '../services/auth.service.js';

const authService = new AuthService();

export const AuthController = {
    login: async (req, res, next) => {
        try {
            res.json(await authService.login(req.body));
        } catch (error) {
            next(error);
        }
    }
};