/**
 * NASA API configuration constants
 * Contains base URL, timeout, and endpoint paths
 */
export const NASA_API_CONFIG = {
  /** Base URL for NASA API */
  BASE_URL: 'https://api.nasa.gov',
  /** Request timeout in milliseconds */
  TIMEOUT: 10000,
  /** API endpoint paths */
  ENDPOINTS: {
    /** Astronomy Picture of the Day endpoint */
    APOD: '/planetary/apod',
    /** Near Earth Objects endpoint */
    NEO: '/neo/rest/v1/feed',
  },
} as const;

/**
 * HTTP status codes used in the application
 */
export const HTTP_STATUS = {
  /** OK (200) */
  OK: 200,
  /** Bad Request (400) */
  BAD_REQUEST: 400,
  /** Not Found (404) */
  NOT_FOUND: 404,
  /** Internal Server Error (500) */
  INTERNAL_SERVER_ERROR: 500,
  /** Service Unavailable (503) */
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Error messages used throughout the application
 */
export const ERROR_MESSAGES = {
  /** Error message for invalid date format */
  INVALID_DATE_FORMAT: 'Invalid date format. Use YYYY-MM-DD',
  /** Error message for exceeding date range limit */
  DATE_RANGE_EXCEEDED: 'Date range cannot exceed 7 days',
  /** Error message for missing required parameters */
  REQUIRED_PARAMETERS: 'start_date and end_date parameters are required',
  /** Error message for NASA API errors */
  NASA_API_ERROR: 'Failed to fetch data from NASA API',
  /** Error message for APOD service errors */
  APOD_ERROR: 'Failed to fetch Astronomy Picture of the Day',
  /** Error message for NEO service errors */
  NEO_ERROR: 'Failed to fetch Near Earth Objects data',
  /** Error message for external service unavailability */
  EXTERNAL_SERVICE_UNAVAILABLE: 'External service unavailable',
} as const;
