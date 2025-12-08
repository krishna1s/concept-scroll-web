import { apiClient as djangoClient } from './api';

// Wrapper to match the interface expected by user's services
// which expects apiClient.get<T>(url) to return { data: T }
export const apiClient = {
  get: async <T,>(url: string, config?: any) => {
    const res = await djangoClient.request<T>(url, { 
       method: 'GET',
       ...config
    });
    return { data: res };
  },
  
  post: async <T,>(url: string, data?: any, config?: any) => {
    const res = await djangoClient.request<T>(url, {
      method: 'POST',
      body: JSON.stringify(data),
      ...config
    });
    return { data: res };
  },
  
  patch: async <T,>(url: string, data?: any, config?: any) => {
    const res = await djangoClient.request<T>(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...config
    });
    return { data: res };
  },
  
  put: async <T,>(url: string, data?: any, config?: any) => {
    const res = await djangoClient.request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...config
    });
    return { data: res };
  },
  
  delete: async <T,>(url: string, config?: any) => {
    const res = await djangoClient.request<T>(url, {
      method: 'DELETE',
      ...config
    });
    return { data: res };
  }
};