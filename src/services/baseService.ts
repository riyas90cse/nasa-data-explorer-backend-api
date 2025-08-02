import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { APIError } from '../middlewares/errorMiddleware';
import {
  NASA_API_CONFIG,
  HTTP_STATUS,
  ERROR_MESSAGES,
} from '../utils/constants';

/**
 * Base service class that provides common functionality for all NASA API services
 * Sets up an Axios client with proper configuration and error handling
 */
export class BaseService {
  /** Axios client instance for making HTTP requests to NASA API */
  protected readonly client: AxiosInstance;
  /** NASA API key used for authentication */
  protected readonly apiKey: string;

  /**
   * Initializes the base service with an Axios client configured for NASA API
   * Uses the NASA_API_KEY environment variable or falls back to DEMO_KEY
   */
  constructor() {
    this.apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';

    this.client = axios.create({
      baseURL: NASA_API_CONFIG.BASE_URL,
      timeout: NASA_API_CONFIG.TIMEOUT,
      params: {
        api_key: this.apiKey,
      },
    });

    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      error => {
        console.error('NASA API Error:', error.message);
        throw new APIError(
          ERROR_MESSAGES.NASA_API_ERROR,
          error.response?.status || HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }
    );
  }
}