/**
 * End-to-End tests for NASA Data Explorer API
 * - Uses supertest against the Express app
 * - Mocks axios at the module level to avoid real HTTP calls to NASA
 */

// Ensure test env before importing the app
process.env.NODE_ENV = 'test';

import request from 'supertest';
import type { AxiosInstance } from 'axios';

// Create a controllable mock axios client
type MockAxios = {
  get: jest.Mock;
  interceptors: {
    request: { use: jest.Mock };
    response: { use: jest.Mock };
  };
  // Keep it loose to avoid Axios v1 headers typing requirements
  defaults: any;
};

const makeMockClient = (): MockAxios => {
  const client: MockAxios = {
    get: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    // Only the params shape is needed by our code; type as any to satisfy TS
    defaults: { params: {} } as any,
  };
  return client;
};

// Module mocks for axios. BaseService uses axios.create(), so we return our mock client from creation.
const mockClient = makeMockClient();

jest.mock('axios', () => {
  return {
    __esModule: true,
    default: {
      // BaseService expects AxiosInstance; assert the mock to that type
      create: jest.fn(() => mockClient as unknown as AxiosInstance),
      // Some services call axios.get directly (not via instance)
      get: (...args: any[]) => (mockClient.get as any)(...args),
    },
  };
});

// Now that axios is mocked, import the app
// eslint-disable-next-line @typescript-eslint/no-var-requires
const app = require('../index').default as import('express').Express;

// Helper to set axios mocked responses per URL
const setAxiosGetHandler = (handler: (url: string, config?: any) => Promise<any>) => {
  mockClient.get.mockImplementation((url: string, config?: any) => handler(url, config));
};

// Default catch-all success for endpoints we don't explicitly test data shape for
const defaultAxiosHandler = async (url: string) => {
  if (typeof url !== 'string') return { data: {} };
  if (url.includes('/planetary/apod')) {
    return { data: { date: '2020-01-01', title: 'Mock APOD', url: 'https://example.com/apod.jpg' } };
  }
  if (url.includes('/mars-photos/api/v1/manifests/')) {
    return { data: { photo_manifest: { name: 'Curiosity', max_date: '2020-07-01' } } };
  }
  if (url.includes('/mars-photos/api/v1/rovers/') && url.includes('/photos')) {
    return { data: { photos: [{ id: 1, img_src: 'https://example.com/mars.jpg', earth_date: '2020-07-01' }] } };
  }
  if (url.includes('/neo/rest/v1/feed')) {
    return { data: { element_count: 1, near_earth_objects: {} } };
  }
  if (url.includes('/EPIC/api/natural')) {
    return { data: [{ identifier: 'mock-epic', caption: 'Mock EPIC image' }] };
  }
  if (url.includes('/search')) {
    return { data: { collection: { items: [] } } };
  }
  return { data: {} };
};

beforeEach(() => {
  mockClient.get.mockReset();
  setAxiosGetHandler(defaultAxiosHandler);
});

describe('Health endpoint', () => {
  it('GET /health should return OK status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        status: 'OK',
        message: expect.any(String),
        timestamp: expect.any(String),
      })
    );
  });
});

describe('API info', () => {
  it('GET /api should return API info', async () => {
    const res = await request(app).get('/api');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          name: expect.any(String),
          version: expect.any(String),
          description: expect.any(String),
          endpoints: expect.objectContaining({
            apod: expect.objectContaining({ path: expect.stringContaining('/api/apod'), method: 'GET' }),
            neo: expect.objectContaining({ path: expect.stringContaining('/api/neo'), method: 'GET' }),
          }),
        }),
      })
    );
  });
});

describe('APOD', () => {
  it('returns 200 for valid date', async () => {
    const res = await request(app).get('/api/apod?date=2020-01-01');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          date: '2020-01-01',
          title: expect.any(String),
          url: expect.stringContaining('http'),
        }),
      })
    );
  });

  it('returns 400 for out-of-range date', async () => {
    const res = await request(app).get('/api/apod?date=1990-01-01');
    expect(res.status).toBe(400);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          message: expect.stringContaining('APOD'),
        }),
      })
    );
  });
});

describe('Mars Rover Photos', () => {
  it('defaults to latest earth_date when no sol or earth_date provided', async () => {
    const res = await request(app).get('/api/mars-rover/curiosity/photos');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: true,
        data: expect.anything(),
      })
    );
  });
});

describe('NEO', () => {
  it('returns 200 for valid 7-day range', async () => {
    const res = await request(app).get('/api/neo?start_date=2020-01-01&end_date=2020-01-07');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({ success: true, data: expect.anything() })
    );
  });

  it('returns 400 when date range exceeds 7 days', async () => {
    const res = await request(app).get('/api/neo?start_date=2020-01-01&end_date=2020-01-20');
    expect(res.status).toBe(400);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({ message: expect.any(String) }),
      })
    );
  });
});

describe('EPIC', () => {
  it('returns EPIC images for a valid date', async () => {
    const res = await request(app).get('/api/epic?date=2020-01-01');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({ success: true, data: expect.anything() })
    );
  });
});

describe('Image Library', () => {
  it('search returns 200 for valid query', async () => {
    const res = await request(app).get('/api/image-library/search?q=moon');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({ success: true, data: expect.anything() })
    );
  });
});

describe('Not Found', () => {
  it('returns 404 with standard error payload', async () => {
    const res = await request(app).get('/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          message: expect.stringContaining('not found'),
        }),
      })
    );
  });
});
