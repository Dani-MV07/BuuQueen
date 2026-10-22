export function normalizeError(error, fallbackMessage = 'Ha ocurrido un error inesperado.') {
  const responseData = error?.response?.data;
  const message = responseData?.message
    || responseData?.error
    || error?.message
    || fallbackMessage;

  return new Error(message);
}
