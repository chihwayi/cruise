import axios from 'axios';

// API URL - use environment variable or default
// Next.js environment variables are embedded at build time for client-side
const getApiUrl = () => {
  // Default API URL
  const defaultUrl = 'http://localhost:3000/api';
  
  // Get from environment variable (embedded at build time in Next.js)
  let baseUrl = process.env.NEXT_PUBLIC_API_URL;
  
  // If not set, use default
  if (!baseUrl) {
    baseUrl = defaultUrl;
  }
  
  // Ensure /api is in the URL (fix for cases where env var doesn't include /api)
  if (baseUrl && !baseUrl.includes('/api')) {
    // Remove trailing slash if present
    baseUrl = baseUrl.replace(/\/$/, '');
    baseUrl = `${baseUrl}/api`;
  }
  
  return baseUrl || defaultUrl;
};

const API_URL = getApiUrl();

// Debug logging (remove in production)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('[API Client] API URL configured:', API_URL);
  console.log('[API Client] Environment variable:', process.env.NEXT_PUBLIC_API_URL);
}

// Create axios instance with proper baseURL
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Ensure baseURL always ends with /api
  validateStatus: (status) => status < 500, // Don't throw on 4xx errors
});

// Override baseURL getter to ensure it's always correct
Object.defineProperty(apiClient.defaults, 'baseURL', {
  get: function() {
    let url = API_URL;
    // Double-check that /api is included
    if (!url.includes('/api')) {
      url = url.replace(/\/$/, '') + '/api';
    }
    return url;
  },
  configurable: true,
});

// Request interceptor to add auth token and ensure correct URL
apiClient.interceptors.request.use(
  (config) => {
    // Ensure baseURL always includes /api
    if (config.baseURL && !config.baseURL.includes('/api')) {
      config.baseURL = config.baseURL.replace(/\/$/, '') + '/api';
    }
    
    // If baseURL is not set, use the API_URL
    if (!config.baseURL) {
      config.baseURL = API_URL;
    }
    
    // Ensure the full URL is correct
    const fullUrl = config.baseURL + (config.url || '');
    if (!fullUrl.includes('/api/')) {
      // Fix the URL by inserting /api before the path
      const urlParts = fullUrl.split('/');
      const protocolHost = urlParts.slice(0, 3).join('/');
      const path = urlParts.slice(3).join('/');
      config.baseURL = protocolHost + '/api';
      config.url = '/' + path;
    }
    
    // Debug logging in development
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('[API Client] Making request to:', config.baseURL + config.url);
    }
    
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

