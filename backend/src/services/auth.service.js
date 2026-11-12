import { AuthRepository } from '../repositories/auth.repository.js';
import { ProfileRepository } from '../repositories/profile.repository.js';
import AppError from '../utils/app-error.js';
import { signJwt } from '../utils/jwt.util.js';
import { verifyPassword } from '../utils/password.util.js';

export class AuthService {
    constructor() {
        this.authRepository = new AuthRepository();
        this.profileRepository = new ProfileRepository();
    }

    async login({ email, password }) {
        const user = await this.authRepository.findUserByEmail(email);
        const isValidPassword = user?.passwordHash
            ? await verifyPassword(user.passwordHash, password)
            : false;

        if (!user || !isValidPassword || !user.isActive || user.status !== 'active') {
            throw new AppError('Correo electrónico o contraseña incorrectos.', 401);
        }

        const profileDocument = await this.profileRepository.findByUserId(user._id);
        const profile = profileDocument && {
            _id: profileDocument._id,
            phone: profileDocument.phone,
            bio: profileDocument.bio
        };
        const token = signJwt(
            {
                role_id: user.role_id?._id?.toString() ?? user.role_id?.toString(),
                role: user.role_id?.slug
            },
            { subject: user._id.toString() }
        );

        return { token, user, profile: profile || null };
    }
}