const API_BASE_URL = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    let errorMsg = 'API request failed';
    try {
      const errData = await response.json();
      errorMsg = errData.message || errorMsg;
    } catch (e) {}
    throw new Error(errorMsg);
  }

  // Handle DELETE or empty responses
  if (response.status === 204) {
    return null;
  }

  return await response.json();
}

export const api = {
  // Auth API
  auth: {
    login: (username, password) => 
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      }),
    register: (username, password) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      }),
    me: () => request('/auth/me')
  },

  // Projects API
  projects: {
    getAll: (search = '', tag = '') => {
      let query = '';
      if (search || tag) {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (tag) params.append('tag', tag);
        query = `?${params.toString()}`;
      }
      return request(`/projects${query}`);
    },
    getOne: (id) => request(`/projects/${id}`),
    create: (data) => request('/projects', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id) => request(`/projects/${id}`, {
      method: 'DELETE'
    }),
    trackClick: (id) => request(`/projects/${id}/click`, {
      method: 'POST'
    })
  },

  // Skills API
  skills: {
    getAll: () => request('/skills'),
    create: (data) => request('/skills', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => request(`/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id) => request(`/skills/${id}`, {
      method: 'DELETE'
    })
  },

  // Experience API
  experience: {
    getAll: () => request('/experience'),
    create: (data) => request('/experience', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => request(`/experience/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id) => request(`/experience/${id}`, {
      method: 'DELETE'
    })
  },

  // Education API
  education: {
    getAll: () => request('/education'),
    create: (data) => request('/education', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => request(`/education/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id) => request(`/education/${id}`, {
      method: 'DELETE'
    })
  },

  // Certifications API
  certifications: {
    getAll: () => request('/certifications'),
    create: (data) => request('/certifications', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => request(`/certifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id) => request(`/certifications/${id}`, {
      method: 'DELETE'
    })
  },

  // Achievements API
  achievements: {
    getAll: () => request('/achievements'),
    create: (data) => request('/achievements', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => request(`/achievements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id) => request(`/achievements/${id}`, {
      method: 'DELETE'
    })
  },

  // Messages API
  messages: {
    submit: (data) => request('/messages', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    getAll: () => request('/messages'),
    updateStatus: (id, status) => request(`/messages/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    }),
    delete: (id) => request(`/messages/${id}`, {
      method: 'DELETE'
    })
  },

  // Blog API
  blog: {
    getAll: (isAdmin = false) => request(`/blog${isAdmin ? '?admin=true' : ''}`),
    getOne: (slug) => request(`/blog/${slug}`),
    create: (data) => request('/blog', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => request(`/blog/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id) => request(`/blog/${id}`, {
      method: 'DELETE'
    })
  },

  // Analytics API
  analytics: {
    trackVisit: () => request('/analytics/visit', { method: 'POST' }),
    trackResumeDownload: () => request('/analytics/resume', { method: 'POST' }),
    getMetrics: () => request('/analytics')
  },

  // LeetCode API
  leetcode: {
    getStats: (username) => request(`/leetcode/${username}`)
  },

  // Upload API
  uploads: {
    uploadImage: async (file) => {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/uploads`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: formData
      });

      if (!response.ok) {
        let errorMsg = 'Upload failed';
        try {
          const errData = await response.json();
          errorMsg = errData.message || errorMsg;
        } catch (e) {}
        throw new Error(errorMsg);
      }

      return await response.json();
    }
  }
};
