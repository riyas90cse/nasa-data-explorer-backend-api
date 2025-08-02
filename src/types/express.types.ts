import { Request, Response } from 'express';
import { ParsedQs } from 'qs';

/**
 * Type-safe Express request with strongly typed query parameters
 * @template T - Type of query parameters
 */
export interface TypedRequest<T extends ParsedQs = ParsedQs> extends Request {
  /** Strongly typed query parameters */
  query: T;
}

/**
 * Type-safe Express response with strongly typed JSON body
 * @template T - Type of response body
 */
export interface TypedResponse<T = unknown> extends Response {
  /**
   * Send JSON response with type checking
   * @param body - Response body with type T
   */
  json: (body: T) => this;
}

/**
 * Query parameters for Astronomy Picture of the Day endpoint
 */
export interface APODQuery extends ParsedQs {
  /** Optional date in YYYY-MM-DD format */
  date?: string;
}

/**
 * Query parameters for Near Earth Objects endpoint
 */
export interface NEOQuery extends ParsedQs {
  /** Start date in YYYY-MM-DD format */
  start_date: string;
  /** End date in YYYY-MM-DD format */
  end_date: string;
}
