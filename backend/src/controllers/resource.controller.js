const createHandler = (operation, statusCode = 200) => async (req, res, next) => {
  try {
    res.status(statusCode).json(await operation(req));
  } catch (error) {
    next(error);
  }
};

export const createResourceController = service => ({
  getAll: createHandler(() => service.getAll()),
  getDeleted: createHandler(() => service.getDeleted()),
  getById: createHandler(req => service.getById(req.params.id)),
  getBySlug: createHandler(req => service.getBySlug(req.params.slug)),
  create: createHandler(req => service.create(req.body), 201),
  update: createHandler(req => service.update(req.params.id, req.body)),
  changeIsActive: createHandler(req => service.changeIsActive(req.params.id, req.body.isActive)),
  changeStatus: createHandler(req => service.changeStatus(req.params.id, req.body.status)),
  restoreDelete: createHandler(req => service.restoreDelete(req.params.id)),
  softDelete: async (req, res, next) => {
    try {
      await service.softDelete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
});
