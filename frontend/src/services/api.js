const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '');

export async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    let message = `Error ${response.status}`;
    try {
      const body = await response.json();
      message = body.message || message;
    } catch {
      // 204 / non-JSON response
    }
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const accommodationsApi = {
  list: () => request('/accommodations')
};

export const categoriesApi = {
  list: () => request('/categories')
};

export const locationsApi = {
  list: () => request('/locations')
};

export const hostsApi = {
  list: () => request('/hosts')
};