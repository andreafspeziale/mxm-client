import type { StandardSchemaV1 } from '@standard-schema/spec';
import type {
  MxmClientOptionalAPIKey,
  MxmClientRequestOptions,
  MxmClientRequestOptionsWithSchema,
  MxmClientResponse,
} from './mxm-client.interfaces.js';

// --- Safe client method types ---

export type SafeGetMethod<TQueryBase, TResponseBase> = {
  <TQuery extends TQueryBase = TQueryBase>(input: {
    query: TQuery & MxmClientOptionalAPIKey;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<TResponseBase>>;

  <TQuery extends TQueryBase, TSchema extends StandardSchemaV1>(input: {
    query: TQuery & MxmClientOptionalAPIKey;
    options: MxmClientRequestOptionsWithSchema<TSchema>;
  }): Promise<MxmClientResponse<StandardSchemaV1.InferOutput<TSchema>>>;
};

export type SafePostMethod<TQueryBase, TBodyBase, TResponseBase> = {
  <
    TQuery extends TQueryBase = TQueryBase,
    TBody extends TBodyBase = TBodyBase,
  >(input: {
    query?: TQuery & MxmClientOptionalAPIKey;
    body: TBody;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<TResponseBase>>;

  <
    TQuery extends TQueryBase,
    TBody extends TBodyBase,
    TSchema extends StandardSchemaV1,
  >(input: {
    query?: TQuery & MxmClientOptionalAPIKey;
    body: TBody;
    options: MxmClientRequestOptionsWithSchema<TSchema>;
  }): Promise<MxmClientResponse<StandardSchemaV1.InferOutput<TSchema>>>;
};

// --- Unsafe client method types ---

export type UnsafeGetMethod<TQueryBase, TResponseBase> = <
  TQuery extends TQueryBase = TQueryBase,
  TResponse extends TResponseBase = TResponseBase,
>(input: {
  query: TQuery & MxmClientOptionalAPIKey;
  options?: MxmClientRequestOptions;
}) => Promise<MxmClientResponse<TResponse>>;

export type UnsafePostMethod<TQueryBase, TBodyBase, TResponseBase> = <
  TQuery extends TQueryBase = TQueryBase,
  TBody extends TBodyBase = TBodyBase,
  TResponse extends TResponseBase = TResponseBase,
>(input: {
  query?: TQuery & MxmClientOptionalAPIKey;
  body: TBody;
  options?: MxmClientRequestOptions;
}) => Promise<MxmClientResponse<TResponse>>;
