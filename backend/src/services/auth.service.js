import { AuthRepository } from '../repositories/auth.repository.js';
import { ProfileRepository } from '../repositories/profile.repository.js';
import { RevokeTokenRepository } from '../repositories/revoke-token.repository.js';
import { UserRepository } from '../repositories/user.repository.js';
import { saveProfileAvatar } from './profile-avatar-storage.js';
import AppError from '../utils/app-error.js';
import { hashJwt, signJwt } from '../utils/jwt.util.js';
import { verifyPassword } from '../utils/password.util.js';

export class AuthService {
    constructor() {
        this.authRepository = new AuthRepository();
        this.profileRepository = new ProfileRepository();
        this.revokeTokenRepository = new RevokeTokenRepository();
        this.userRepository = new UserRepository();
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
            avatar: profileDocument.avatar,
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

    async getMyProfile(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new AppError('No se encontró el usuario.', 404);
        }

        const profile = await this.profileRepository.findByUserId(userId);
        return { user, profile: profile || null };
    }

    async updateMyProfile(userId, payload) {
        const currentUser = await this.userRepository.findById(userId);
        if (!currentUser) {
            throw new AppError('No se encontró el usuario.', 404);
        }

        const userData = Object.fromEntries(
            ['name', 'email']
                .filter((field) => Object.hasOwn(payload, field))
                .map((field) => [field, payload[field]])
        );
        if (Object.keys(userData).length) {
            try {
                await this.userRepository.update(userId, userData);
            } catch (error) {
                if (error.code === 11000) {
                    throw new AppError('Ya existe una cuenta con ese correo electrónico.', 409);
                }
                throw error;
            }
        }

        const profileData = Object.fromEntries(
            ['phone', 'bio', 'avatar']
                .filter((field) => Object.hasOwn(payload, field))
                .map((field) => [field, payload[field]])
        );
        if (Object.keys(profileData).length) {
            if (Object.hasOwn(profileData, 'avatar')) {
                profileData.avatar = await saveProfileAvatar(userId, profileData.avatar);
            }
            const currentProfile = await this.profileRepository.findByUserIdIncludingDeleted(userId);
            if (currentProfile?.deletedAt) {
                await this.profileRepository.restoreDelete(currentProfile._id);
            }
            if (currentProfile) {
                await this.profileRepository.update(currentProfile._id, profileData);
            } else {
                await this.profileRepository.create({ user_id: userId, ...profileData });
            }
        }

        return this.getMyProfile(userId);
    }

    async logout({ token, userId, expiresAt }) {
        if (!token || !userId || !Number.isInteger(expiresAt)) {
            throw new AppError('El token de sesión no es válido.', 400);
        }

        await this.revokeTokenRepository.revokeToken({
            tokenHash: hashJwt(token),
            userId,
            expiresAt: new Date(expiresAt * 1000)
        });

        return { message: 'Sesión cerrada correctamente.' };
    }
}
