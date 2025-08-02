export const NASA_API_CONFIG = {
  BASE_URL: 'https://api.nasa.gov',
  TIMEOUT: 10000,
  ENDPOINTS: {
    APOD: '/planetary/apod',
    NEO: '/neo/rest/v1/feed',
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const ERROR_MESSAGES = {
  INVALID_DATE_FORMAT: 'Invalid date format. Use YYYY-MM-DD',
  DATE_RANGE_EXCEEDED: 'Date range cannot exceed 7 days',
  REQUIRED_PARAMETERS: 'start_date and end_date parameters are required',
  NASA_API_ERROR: 'Failed to fetch data from NASA API',
  APOD_ERROR: 'Failed to fetch Astronomy Picture of the Day',
  NEO_ERROR: 'Failed to fetch Near Earth Objects data',
  EXTERNAL_SERVICE_UNAVAILABLE: 'External service unavailable',
} as const;
