import type { StandardSchemaV1 } from '@standard-schema/spec';
import type { Logger, LoggerOptions } from 'pino';
import type { Client, Interceptable } from 'undici';
import type { UndiciHeaders } from 'undici/types/dispatcher.js';

export type AllowedHTTPMethods = 'GET' | 'POST';

export interface Request<B> {
  client: Client | Interceptable;
  method: AllowedHTTPMethods;
  path: string;
  headers?: UndiciHeaders;
  body?: B;
}

export interface Response {
  statusCode: number;
  data: unknown;
}

export type APIErrorDetails =
  | {
      method: AllowedHTTPMethods;
      path: string;
      statusCode?: number;
      headers?: unknown;
      body?: unknown;
      data?: unknown;
      cause: unknown;
    }
  | {
      method: AllowedHTTPMethods;
      endpoint: string;
      statusCode?: number;
      headers?: unknown;
      body?: unknown;
      data?: unknown;
      cause: unknown;
    };

export interface MxmClientOptionalAPIKey {
  apiKey?: string | undefined;
}

export interface MxmClientRequestOptions {
  disableStatusCodeValidation?: boolean;
}

export interface MxmClientRequestOptionsWithSchema<
  TSchema extends StandardSchemaV1 = StandardSchemaV1,
> extends MxmClientRequestOptions {
  responseSchema: TSchema;
}

export interface MxmClientConfig extends MxmClientOptionalAPIKey {
  enableLog?: boolean;
  defaultLoggerConfig?: LoggerOptions;
  disableStatusCodeValidation?: boolean;
}

export interface BaseEndpointInput<
  TParams extends Record<string, string> = Record<string, never>,
  TQuery = Record<string, never>,
  TBody = never,
> {
  params?: TParams;
  query?: TQuery;
  body?: TBody;
}

export interface EndpointPayload<
  TParams extends Record<string, string> = Record<string, never>,
  TQuery = Record<string, never>,
  TBody = never,
> {
  input: BaseEndpointInput<TParams, TQuery & MxmClientOptionalAPIKey, TBody>;
  client: Client | Interceptable;
  logger?: Logger | undefined;
  options?: MxmClientRequestOptions;
}

export interface MxmClientResponse<T> {
  message: {
    header: {
      status_code: number;
      execute_time: number;
    };
    body: T;
  };
}
