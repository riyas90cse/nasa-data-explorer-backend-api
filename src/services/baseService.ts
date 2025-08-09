import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { APIError } from '../middlewares/errorMiddleware';
import {
  NASA_API_CONFIG,
  HTTP_STATUS,
  ERROR_MESSAGES,
} from '../utils/constants';
import logger from '../utils/logger';
import CircuitBreaker from '../utils/circuitBreaker';

/**
 * Base service class that provides common functionality for all NASA API services
 * Sets up an Axios client with proper configuration and error handling
 */
export class BaseService {
  /** Axios client instance for making HTTP requests to NASA API */
  protected readonly client: AxiosInstance;
  /** NASA API key used for authentication */
  protected readonly apiKey: string;
  /** Simple circuit breaker to protect upstream NASA API */
  protected readonly breaker: CircuitBreaker;

  /**
   * Initializes the base service with an Axios client configured for NASA API
   * Uses the NASA_API_KEY environment variable or falls back to DEMO_KEY
   */
  constructor() {
    this.apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
    this.breaker = new CircuitBreaker({ failureThreshold: 5, successThreshold: 2, cooldownPeriodMs: 30000 });

    this.client = axios.create({
      baseURL: NASA_API_CONFIG.BASE_URL,
      timeout: NASA_API_CONFIG.TIMEOUT,
      params: {
        api_key: this.apiKey,
      },
    });

    // Request interceptor: block if breaker is OPEN
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        if (!this.breaker.allowRequest()) {
          throw new APIError(
            ERROR_MESSAGES.EXTERNAL_SERVICE_UNAVAILABLE,
            HTTP_STATUS.SERVICE_UNAVAILABLE
          );
        }
        return config;
      },
      error => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // mark success for breaker
        this.breaker.recordSuccess();
        return response;
      },
      error => {
        logger.error({ err: error }, 'NASA API Error');
        // Try to extract a meaningful message from NASA API error responses
        const status = error.response?.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
        const data = error.response?.data;
        const nasaMessage =
          (typeof data === 'string' && data) ||
          data?.error?.message ||
          data?.msg ||
          data?.message ||
          ERROR_MESSAGES.NASA_API_ERROR;
        // mark failure for breaker
        try { this.breaker.recordFailure(); } catch (_) { /* noop */ }

        throw new APIError(nasaMessage, status);
      }
    );
  }
}