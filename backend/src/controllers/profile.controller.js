import { ProfileService } from '../services/profile.service.js';

const createHandler = (operation, statusCode = 200) => async (req, res, next) => {
    try {
        res.status(statusCode).json(await operation(req));
    } catch (error) {
        next(error);
    }
};

const profileService = new ProfileService();

export const ProfileController = {
    getAll: createHandler(() => profileService.getAll()),
    getDeleted: createHandler(() => profileService.getDeleted()),
    getById: createHandler((req) => profileService.getById(req.params.id)),
    getByUserId: createHandler((req) => profileService.getByUserId(req.params.userId)),
    create: createHandler((req) => profileService.create(req.body), 201),
    update: createHandler((req) => profileService.update(req.params.id, req.body)),
    restoreDelete: createHandler((req) => profileService.restoreDelete(req.params.id)),
    softDelete: async (req, res, next) => {
        try {
            await profileService.softDelete(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
};