import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ahphan.com/idea-app';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
});

// Token storage utilities
export const tokenStorage = {
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  },
  
  setAccessToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('accessToken', token);
  },
  
  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
  },
  
  setRefreshToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('refreshToken', token);
  },
  
  clearTokens: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};

// CSRF token utilities
export const csrfStorage = {
  getCsrfToken: (): string | null => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  },
};

// Request interceptor to add auth token and CSRF token
// apiClient.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const token = tokenStorage.getAccessToken();
//     if (token && config.headers) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
    
//     // Add CSRF token for state-changing requests
//     if (config.method && ['post', 'put', 'delete', 'patch'].includes(config.method.toLowerCase())) {
//       const csrfToken = csrfStorage.getCsrfToken();
//       if (csrfToken && config.headers) {
//         config.headers['X-XSRF-TOKEN'] = csrfToken;
//       }
//     }
    
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor for token refresh
// let isRefreshing = false;
// let failedQueue: Array<{
//   resolve: (value?: unknown) => void;
//   reject: (reason?: unknown) => void;
// }> = [];

// const processQueue = (error: Error | null, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
  
//   failedQueue = [];
// };

// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             if (originalRequest.headers) {
//               originalRequest.headers.Authorization = `Bearer ${token}`;
//             }
//             return apiClient(originalRequest);
//           })
//           .catch((err) => {
//             return Promise.reject(err);
//           });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       const refreshToken = tokenStorage.getRefreshToken();
      
//       if (!refreshToken) {
//         tokenStorage.clearTokens();
//         if (typeof window !== 'undefined') {
//           window.location.href = '/login';
//         }
//         return Promise.reject(error);
//       }

//       try {
//         const response = await axios.post(`${API_URL}/auth/refresh`, {
//           refreshToken,
//         });
        
//         const { accessToken, refreshToken: newRefreshToken } = response.data;
//         tokenStorage.setAccessToken(accessToken);
//         tokenStorage.setRefreshToken(newRefreshToken);
        
//         if (originalRequest.headers) {
//           originalRequest.headers.Authorization = `Bearer ${accessToken}`;
//         }
        
//         processQueue(null, accessToken);
        
//         return apiClient(originalRequest);
//       } catch (refreshError) {
//         processQueue(refreshError as Error, null);
//         tokenStorage.clearTokens();
//         if (typeof window !== 'undefined') {
//           window.location.href = '/login';
//         }
//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }
    
//     return Promise.reject(error);
//   }
// );

export default apiClient;
