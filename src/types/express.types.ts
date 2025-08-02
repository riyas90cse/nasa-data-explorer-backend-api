import { Request, Response } from 'express';
import { ParsedQs } from 'qs';

export interface TypedRequest<T extends ParsedQs = ParsedQs> extends Request {
  query: T;
}

export interface TypedResponse<T = unknown> extends Response {
  json: (body: T) => this;
}

export interface APODQuery extends ParsedQs {
  date?: string;
}

export interface NEOQuery extends ParsedQs {
  start_date: string;
  end_date: string;
}
