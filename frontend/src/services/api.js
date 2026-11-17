import { getAuthToken } from '../utils/authStorage';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '');

export async function request(path, options = {}) {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
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
  list: () => request('/categories'),
  listDeleted: () => request('/categories/deleted'),
  get: (id) => request(`/categories/${id}`),
  create: (data) => request('/categories', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => request(`/categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  setActive: (id, isActive) => request(`/categories/${id}/is-active`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive })
  }),
  setStatus: (id, status) => request(`/categories/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),
  remove: (id) => request(`/categories/${id}`, { method: 'DELETE' }),
  restore: (id) => request(`/categories/${id}/restore`, { method: 'PATCH' })
};

export const locationsApi = {
  list: () => request('/locations')
};

export const hostsApi = {
  list: () => request('/hosts')
};

export const authApi = {
  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  logout: (token) => request('/auth/logout', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })
};