const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Request failed');
    }

    return response.json();
  },

  auth: {
    register: (data: any) => api.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    login: (data: any) => api.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getProfile: () => api.request('/auth/profile'),
  },

  repositories: {
    create: (data: any) => api.request('/repositories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getAll: () => api.request('/repositories'),
    getOne: (id: string) => api.request(`/repositories/${id}`),
    update: (id: string, data: any) => api.request(`/repositories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: string) => api.request(`/repositories/${id}`, {
      method: 'DELETE',
    }),
  },

  codeReviews: {
    create: (data: any) => api.request('/code-reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getAll: (repositoryId?: string) => api.request(`/code-reviews${repositoryId ? `?repositoryId=${repositoryId}` : ''}`),
    getOne: (id: string) => api.request(`/code-reviews/${id}`),
    update: (id: string, data: any) => api.request(`/code-reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    updateStatus: (id: string, status: string) => api.request(`/code-reviews/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
    delete: (id: string) => api.request(`/code-reviews/${id}`, {
      method: 'DELETE',
    }),
  },

  comments: {
    create: (data: any) => api.request('/comments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getAll: (codeReviewId: string) => api.request(`/comments/${codeReviewId}`),
    update: (id: string, data: any) => api.request(`/comments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: string) => api.request(`/comments/${id}`, {
      method: 'DELETE',
    }),
  },

  suggestions: {
    create: (data: any) => api.request('/suggestions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getAll: (codeReviewId: string) => api.request(`/suggestions/${codeReviewId}`),
    update: (id: string, data: any) => api.request(`/suggestions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: string) => api.request(`/suggestions/${id}`, {
      method: 'DELETE',
    }),
  },
};
