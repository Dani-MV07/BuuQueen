const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '');

async function request(path, options = {}) {
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
  list: () => request('/accommodations'),
  listDeleted: () => request('/accommodations/deleted'),
  get: (id) => request(`/accommodations/${id}`),
  create: (data) => request('/accommodations', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => request(`/accommodations/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  setActive: (id, isActive) => request(`/accommodations/${id}/is-active`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive })
  }),
  setStatus: (id, status) => request(`/accommodations/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),
  remove: (id) => request(`/accommodations/${id}`, { method: 'DELETE' }),
  restore: (id) => request(`/accommodations/${id}/restore`, { method: 'PATCH' })
};