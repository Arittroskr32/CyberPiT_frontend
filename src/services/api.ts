import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Debug logging for environment
console.log('API_BASE_URL:', API_BASE_URL);
console.log('Environment vars:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  NODE_ENV: import.meta.env.NODE_ENV,
  MODE: import.meta.env.MODE
});

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API endpoints
export const apiService = {
  // Public APIs
  contact: {
    submit: (data: any) => api.post('/contact', data),
  },
  
  subscriptions: {
    subscribe: (email: string) => api.post('/subscriptions', { email }),
  },
  
  team: {
    apply: (data: any) => api.post('/team/apply', data),
    getAll: () => api.get('/admin/team'),
  },
  
  projects: {
    getAll: () => api.get('/projects'),
    getFeatured: () => api.get('/projects/featured'),
  },
  
  reports: {
    submit: (data: any) => api.post('/reports', data),
  },
  
  videos: {
    getCurrent: () => api.get('/videos/current'),
  },
  
  feedback: {
    getAll: () => api.get('/feedback'),
    submit: (data: any) => api.post('/feedback', data),
  },
  
  // Admin APIs
  auth: {
    login: (email: string, password: string) => api.post('/auth/login', { email, password }),
    verify: () => api.get('/auth/verify'),
  },
  
  admin: {
    onlyAdminLogin: (email: string, password: string) => api.post('/admin/only_admin/login', { email, password }),
    getDashboard: () => api.get('/admin/dashboard'),
    getContacts: () => api.get('/admin/contacts'),
    updateContact: (id: string, data: any) => api.patch(`/admin/contacts/${id}`, data),
    deleteContact: (id: string) => api.delete(`/admin/contacts/${id}`),
    clearAllContacts: () => api.delete('/admin/contacts'),
    updateContactStatus: (id: string, status: string) => api.patch(`/admin/contacts/${id}`, { status }),
    
    // Video management
    getVideos: () => api.get('/admin/videos'),
    uploadVideo: (formData: FormData) => api.post('/admin/videos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    deleteVideo: (id: string) => api.delete(`/admin/videos/${id}`),
    
    // Subscription management
    getSubscriptions: () => api.get('/admin/subscriptions'),
    updateSubscription: (id: string, data: any) => api.patch(`/admin/subscriptions/${id}`, data),
    deleteSubscription: (id: string) => api.delete(`/admin/subscriptions/${id}`),
    deleteSubscriptions: (ids: string[]) => api.delete('/admin/subscriptions/batch', { data: { ids } }),
    sendBulkEmail: (data: { subject: string; body: string }) => api.post('/admin/subscriptions/bulk-email', data),
    
    // Feedback management
    getFeedbacks: () => api.get('/admin/feedback'),
    addFeedback: (data: any) => api.post('/admin/feedback', data),
    updateFeedback: (id: string, data: any) => api.patch(`/admin/feedback/${id}`, data),
    deleteFeedback: (id: string) => api.delete(`/admin/feedback/${id}`),
    
    // Team management
    getTeamMembers: () => api.get('/admin/team'),
    addTeamMember: (data: any) => api.post('/admin/team', data),
    updateTeamMember: (id: string, data: any) => api.patch(`/admin/team/${id}`, data),
    deleteTeamMember: (id: string) => api.delete(`/admin/team/${id}`),
    setupDefaultTeam: () => api.post('/admin/setup-default-team'),
    
    // Project management
    getProjects: () => api.get('/admin/projects'),
    addProject: (data: any) => api.post('/admin/projects', data),
    updateProject: (id: string, data: any) => api.patch(`/admin/projects/${id}`, data),
    deleteProject: (id: string) => api.delete(`/admin/projects/${id}`),
    setupDefaultProjects: () => api.post('/admin/setup-default-projects'),
    
    // Report management
    getReports: () => api.get('/admin/reports'),
    getReport: (id: string) => api.get(`/admin/reports/${id}`),
    updateReport: (id: string, data: any) => api.patch(`/admin/reports/${id}`, data),
    deleteReport: (id: string) => api.delete(`/admin/reports/${id}`),
    clearAllReports: () => api.delete('/admin/reports'),
    
    // Application management
    getApplications: () => api.get('/admin/applications'),
    getApplication: (id: string) => api.get(`/admin/applications/${id}`),
    updateApplication: (id: string, data: any) => api.patch(`/admin/applications/${id}`, data),
    deleteApplication: (id: string) => api.delete(`/admin/applications/${id}`),
    clearAllApplications: () => api.delete('/admin/applications'),
  },
};

export default apiService;
