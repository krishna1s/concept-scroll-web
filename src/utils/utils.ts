/**
 * Utility functions
 */

export const logOperation = (service: string, method: string, message: string, data?: any) => {
  console.log(`[${service}] ${method}: ${message}`, data || '');
};

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
