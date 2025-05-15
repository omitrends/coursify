import axios from 'axios';

// Determine if we're in production
const isProd = import.meta.env.PROD;

// Set the base URL based on environment
const api = axios.create({
  baseURL: isProd ? 'https://coursify-px6g.onrender.com' : '',
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// User API calls
export const userAPI = {
  signup: (userData) => api.post('/api/v1/user/signup', userData),
  signin: (credentials) => api.post('/api/v1/user/signin', credentials),
  getPurchases: () => api.get('/api/v1/user/purchases'),
  purchaseCourse: (courseId) => api.post('/api/v1/course/purchase', { courseId }),
};

// Admin API calls
export const adminAPI = {
  signup: (userData) => api.post('/api/v1/admin/signup', userData),
  signin: (credentials) => api.post('/api/v1/admin/signin', credentials),
  createCourse: (courseData) => api.post('/api/v1/admin/course', courseData),
  updateCourse: (courseData) => api.put('/api/v1/admin/course', courseData),
  getCourses: () => api.get('/api/v1/admin/course/bulk'),
};

// Course API calls
export const courseAPI = {
  getAllCourses: () => api.get('/api/v1/course/preview'),
};

export default api; 