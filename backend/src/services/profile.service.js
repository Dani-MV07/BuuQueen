import mongoose from 'mongoose';
import { ProfileRepository } from '../repositories/profile.repository.js';
import { UserRepository } from '../repositories/user.repository.js';
import AppError from '../utils/app-error.js';

const profileFields = ['phone', 'bio'];

export class ProfileService {
    constructor() {
        this.repository = new ProfileRepository();
        this.userRepository = new UserRepository();
    }

    async getAll() {
        return this.repository.findAll();
    }

    async getDeleted() {
        return this.repository.findDeleted();
    }

    async getById(id) {
        this.#validateObjectId(id);
        const profile = await this.repository.findById(id);
        if (!profile) {
            throw this.#notFound();
        }
        return profile;
    }

    async getByUserId(userId) {
        this.#validateObjectId(userId, 'El ID de usuario no es válido.');
        const profile = await this.repository.findByUserId(userId);
        if (!profile) {
            throw this.#notFound();
        }
        return profile;
    }

    async create(payload) {
        const userId = payload.user_id;
        this.#validateObjectId(userId, 'El ID de usuario no es válido.');

        if (!await this.userRepository.findById(userId)) {
            throw new AppError('No se encontró el usuario asociado.', 404);
        }
        if (await this.repository.existsByReference('user_id', userId)) {
            throw new AppError('El usuario ya tiene un perfil.', 409);
        }

        try {
            return await this.repository.create(payload);
        } catch (error) {
            if (error.code === 11000) {
                throw new AppError('El usuario ya tiene un perfil.', 409);
            }
            throw error;
        }
    }

    async update(id, payload) {
        this.#validateObjectId(id);
        const data = Object.fromEntries(
            profileFields
                .filter((field) => Object.hasOwn(payload, field))
                .map((field) => [field, payload[field]])
        );
        if (!Object.keys(data).length) {
            throw new AppError('Debe proporcionar al menos un campo para actualizar.', 400);
        }

        const profile = await this.repository.update(id, data);
        if (!profile) {
            throw this.#notFound();
        }
        return profile;
    }

    async softDelete(id) {
        this.#validateObjectId(id);
        const profile = await this.repository.softDelete(id);
        if (!profile) {
            throw this.#notFound();
        }
    }

    async restoreDelete(id) {
        this.#validateObjectId(id);
        const current = await this.repository.findByIdIncludingDeleted(id);
        if (!current?.deletedAt) {
            throw this.#notFound();
        }

        const profile = await this.repository.restoreDelete(id);
        if (!profile) {
            throw this.#notFound();
        }
        return profile;
    }

    #validateObjectId(id, message = 'El ID proporcionado no es válido.') {
        if (!mongoose.isObjectIdOrHexString(id)) {
            throw new AppError(message, 400);
        }
    }

    #notFound() {
        return new AppError('No se encontró el perfil.', 404);
    }
}