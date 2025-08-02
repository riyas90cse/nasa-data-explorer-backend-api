/**
 * Standard API response format used throughout the application
 * @template T - Type of data returned in the response
 */
export interface APIResponse<T = unknown> {
  /** Indicates if the request was successful */
  success: boolean;
  /** Response data (present only for successful requests) */
  data?: T;
  /** Error information (present only for failed requests) */
  error?: {
    /** Error message */
    message: string;
    /** Error stack trace (only in development mode) */
    stack?: string;
  };
}

/**
 * API information structure returned by the info endpoint
 * Contains details about available endpoints and their parameters
 */
export interface APIInfo {
  /** API name */
  name: string;
  /** API version */
  version: string;
  /** API description */
  description: string;
  /** Available API endpoints with their details */
  endpoints: {
    /** Astronomy Picture of the Day endpoint */
    apod: {
      /** Endpoint path */
      path: string;
      /** HTTP method */
      method: string;
      /** Endpoint description */
      description: string;
      /** Query parameters */
      parameters: {
        /** Date parameter description */
        date: string;
      };
    };
    /** Near Earth Objects endpoint */
    neo: {
      /** Endpoint path */
      path: string;
      /** HTTP method */
      method: string;
      /** Endpoint description */
      description: string;
      /** Query parameters */
      parameters: {
        /** Start date parameter description */
        start_date: string;
        /** End date parameter description */
        end_date: string;
      };
    };
    /** Mars Rover Photos endpoint */
    marsRover: {
      /** Endpoint path */
      path: string;
      /** HTTP method */
      method: string;
      /** Endpoint description */
      description: string;
      /** Query parameters */
      parameters: {
        /** Rover name parameter description */
        rover: string;
        /** Sol parameter description */
        sol: string;
        /** Earth date parameter description */
        earth_date: string;
        /** Camera parameter description */
        camera: string;
        /** Page parameter description */
        page: string;
      };
    };
    /** EPIC Earth Images endpoint */
    epic: {
      /** Endpoint path */
      path: string;
      /** HTTP method */
      method: string;
      /** Endpoint description */
      description: string;
      /** Query parameters */
      parameters: {
        /** Date parameter description */
        date: string;
      };
    };
    /** NASA Image Library Search endpoint */
    imageLibrary: {
      /** Endpoint path */
      path: string;
      /** HTTP method */
      method: string;
      /** Endpoint description */
      description: string;
      /** Query parameters */
      parameters: {
        /** Search query parameter description */
        q: string;
        /** Media type parameter description */
        media_type: string;
        /** Page parameter description */
        page: string;
        /** Page size parameter description */
        page_size: string;
        /** Year start parameter description */
        year_start: string;
        /** Year end parameter description */
        year_end: string;
      };
    };
  };
}

/**
 * Response structure for the health check endpoint
 */
export interface HealthResponse {
  /** Current status of the API */
  status: string;
  /** Status message */
  message: string;
  /** Timestamp of the health check */
  timestamp: string;
}
