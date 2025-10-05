import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  }
};

// Blog Service
export const blogService = {
  getAllPosts: async () => {
    const response = await api.get('/posts');
    return response.data;
  },
  
  getPostById: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },
  
  getPostsByAuthor: async (authorId) => {
    const response = await api.get(`/posts/author/${authorId}`);
    return response.data;
  },
  
  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },
  
  updatePost: async (id, postData) => {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  },
  
  deletePost: async (id) => {
    await api.delete(`/posts/${id}`);
  },
  
  likePost: async (id) => {
    const response = await api.post(`/posts/${id}/like`);
    return response.data;
  },
  
  searchPosts: async (query) => {
    const response = await api.get(`/posts/search?query=${query}`);
    return response.data;
  }
};

// Comment Service
export const commentService = {
  getCommentsByPost: async (postId) => {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  },
  
  createComment: async (postId, commentData) => {
    const response = await api.post(`/posts/${postId}/comments`, commentData);
    return response.data;
  },
  
  updateComment: async (postId, commentId, commentData) => {
    const response = await api.put(`/posts/${postId}/comments/${commentId}`, commentData);
    return response.data;
  },
  
  deleteComment: async (postId, commentId) => {
    await api.delete(`/posts/${postId}/comments/${commentId}`);
  }
};

// User Service
export const userService = {
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
  
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  updateProfile: async (userData) => {
    const response = await api.put('/users/me', userData);
    return response.data;
  },
  
  changePassword: async (passwordData) => {
    await api.put('/users/change-password', passwordData);
  },
  
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },
  
  deleteUser: async (id) => {
    await api.delete(`/users/${id}`);
  }
};

// File Upload Service
export const fileService = {
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export default api;
