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

export const experiencesApi = {
  list: () => request('/experiences'),
  listDeleted: () => request('/experiences/deleted'),
  get: (id) => request(`/experiences/${id}`),
  create: (data) => request('/experiences', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => request(`/experiences/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  setActive: (id, isActive) => request(`/experiences/${id}/is-active`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive })
  }),
  setStatus: (id, status) => request(`/experiences/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),
  remove: (id) => request(`/experiences/${id}`, { method: 'DELETE' }),
  restore: (id) => request(`/experiences/${id}/restore`, { method: 'PATCH' })
};