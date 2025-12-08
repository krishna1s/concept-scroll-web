/**
 * API Client Factory
 * 
 * This file exports a singleton API client instance.
 * Switched to Django backend with OTP authentication.
 */

import { IApiClient } from './contract';
import { DjangoApiClient } from './djangoClient';
import { BACKEND_BASE_URL } from '../../config/api';

// Initialize Django API client
export const apiClient: IApiClient & { setUnauthorizedCallback?: (cb: () => void) => void } = new DjangoApiClient(BACKEND_BASE_URL);

export { DjangoApiClient };

// Export the interface for type checking
export type { IApiClient } from './contract';