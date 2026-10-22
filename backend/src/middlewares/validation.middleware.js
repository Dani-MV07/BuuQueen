export const validateRequest = schema => (req, res, next) => {
  const validation = schema.safeParse({
    body: req.body,
    params: req.params
  });

  if (!validation.success) {
    return res.status(400).json({
      message: 'Datos de entrada no válidos.',
      errors: validation.error.issues.map(issue => ({
        path: issue.path.join('.'),
        message: issue.message
      }))
    });
  }

  if (validation.data.body) {
    req.body = validation.data.body;
  }
  if (validation.data.params) {
    req.params = validation.data.params;
  }

  next();
};
