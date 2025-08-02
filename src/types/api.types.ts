export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    stack?: string;
  };
}

export interface APIInfo {
  name: string;
  version: string;
  description: string;
  endpoints: {
    apod: {
      path: string;
      method: string;
      description: string;
      parameters: {
        date: string;
      };
    };
    neo: {
      path: string;
      method: string;
      description: string;
      parameters: {
        start_date: string;
        end_date: string;
      };
    };
    marsRover: {
      path: string;
      method: string;
      description: string;
      parameters: {
        rover: string;
        sol: string;
        earth_date: string;
        camera: string;
        page: string;
      };
    };
    epic: {
      path: string;
      method: string;
      description: string;
      parameters: {
        date: string;
      };
    };
    imageLibrary: {
      path: string;
      method: string;
      description: string;
      parameters: {
        q: string;
        media_type: string;
        page: string;
        page_size: string;
        year_start: string;
        year_end: string;
      };
    };
  };
}

export interface HealthResponse {
  status: string;
  message: string;
  timestamp: string;
}
