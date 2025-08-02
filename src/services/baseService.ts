import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { APIError } from '../middlewares/errorMiddleware';
import {
  NASA_API_CONFIG,
  HTTP_STATUS,
  ERROR_MESSAGES,
} from '../utils/constants';

export class BaseService {
  protected readonly client: AxiosInstance;
  protected readonly apiKey: string;

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