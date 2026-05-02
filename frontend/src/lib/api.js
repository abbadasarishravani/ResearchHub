const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
export const api = {
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        const headers = {
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
        register: (data) => api.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
        login: (data) => api.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
        getProfile: () => api.request('/auth/profile'),
    },
    repositories: {
        create: (data) => api.request('/repositories', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
        getAll: () => api.request('/repositories'),
        getOne: (id) => api.request(`/repositories/${id}`),
        update: (id, data) => api.request(`/repositories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
        delete: (id) => api.request(`/repositories/${id}`, {
            method: 'DELETE',
        }),
    },
    codeReviews: {
        create: (data) => api.request('/code-reviews', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
        getAll: (repositoryId) => api.request(`/code-reviews${repositoryId ? `?repositoryId=${repositoryId}` : ''}`),
        getOne: (id) => api.request(`/code-reviews/${id}`),
        update: (id, data) => api.request(`/code-reviews/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
        updateStatus: (id, status) => api.request(`/code-reviews/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        }),
        delete: (id) => api.request(`/code-reviews/${id}`, {
            method: 'DELETE',
        }),
    },
    comments: {
        create: (data) => api.request('/comments', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
        getAll: (codeReviewId) => api.request(`/comments/${codeReviewId}`),
        update: (id, data) => api.request(`/comments/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
        delete: (id) => api.request(`/comments/${id}`, {
            method: 'DELETE',
        }),
    },
    suggestions: {
        create: (data) => api.request('/suggestions', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
        getAll: (codeReviewId) => api.request(`/suggestions/${codeReviewId}`),
        update: (id, data) => api.request(`/suggestions/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
        delete: (id) => api.request(`/suggestions/${id}`, {
            method: 'DELETE',
        }),
    },
};
