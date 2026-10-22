export const handleServiceError = error => {
  if (error instanceof Error) {
    return error;
  }

  return new Error('Error inesperado en el servicio.', { cause: error });
};
