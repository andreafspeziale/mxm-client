import type { StandardSchemaV1 } from '@standard-schema/spec';
import type { Logger } from 'pino';
import type { z } from 'zod';
import { fromError } from 'zod-validation-error';
import type { ZodError } from 'zod-validation-error/v3';
import type { MxmClientError } from './mxm-client.error.js';
import type {
  AllowedHTTPMethods,
  APIErrorDetails,
  MxmClientOptionalAPIKey,
  MxmClientRequestOptions,
  MxmClientResponse,
  Request,
  Response,
} from './mxm-client.interfaces.js';
import { apiKeySchema } from './mxm-client.schemas.js';

export const throwAPIError = ({
  message,
  details,
  logger,
  errorToBeInitialized,
}: {
  message: string;
  details: APIErrorDetails;
  logger?: Logger | undefined;
  errorToBeInitialized: typeof MxmClientError;
}): never => {
  logger?.error({ fn: throwAPIError.name, ...details }, message);

  throw new errorToBeInitialized(message, details);
};

export const buildUrl = async <TQuery extends MxmClientOptionalAPIKey>({
  endpoint,
  params,
  query,
  method,
  logger,
  errorToBeInitialized,
}: {
  endpoint: string;
  params?: Record<string, string>;
  query: TQuery;
  method: AllowedHTTPMethods;
  logger?: Logger | undefined;
  errorToBeInitialized: typeof MxmClientError;
}): Promise<string> => {
  await apiKeySchema.parseAsync(query.apiKey).catch((error: ZodError) =>
    throwAPIError({
      message: 'API key is required',
      details: {
        method,
        endpoint,
        cause: fromError(error),
      },
      logger,
      errorToBeInitialized,
    }),
  );

  let resolvedEndpoint = endpoint;
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      resolvedEndpoint = resolvedEndpoint
        .replace(`:${key}`, encodeURIComponent(value))
        .replace(`{${key}}`, encodeURIComponent(value));
    }
  }

  const queryString = Object.entries(query)
    .filter((entry): entry is [string, string] => {
      const [_, value] = entry;
      return value !== null && value !== undefined && value !== '';
    })
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key === 'apiKey' ? 'apikey' : key)}=${encodeURIComponent(value)}`,
    )
    .join('&');

  if (!queryString) {
    return resolvedEndpoint;
  }

  const separator = resolvedEndpoint.includes('?') ? '&' : '?';
  return `${resolvedEndpoint}${separator}${queryString}`;
};

export const handleRequest = async <B>({
  client,
  method,
  path,
  headers,
  body,
  logger,
  errorToBeInitialized,
}: Request<B> & {
  logger?: Logger | undefined;
  errorToBeInitialized: typeof MxmClientError;
}): Promise<Response> => {
  const currentHeaders = {
    'content-type': 'application/json',
    ...headers,
  };

  logger?.debug(
    {
      fn: handleRequest.name,
      method,
      path,
      headers: currentHeaders,
      ...(body ? { body } : {}),
    },
    'Handling request...',
  );

  const { statusCode, ...request } = await client
    .request({
      method,
      path,
      headers: currentHeaders,
      ...(body ? { body: JSON.stringify(body) } : {}),
    })
    .catch((error: unknown) =>
      throwAPIError({
        message: 'Something went wrong during the request',
        details: {
          method,
          path,
          headers: currentHeaders,
          ...(body ? { body } : {}),
          cause: error,
        },
        logger,
        errorToBeInitialized,
      }),
    );

  return {
    statusCode,
    data: await request.body.json().catch((error: unknown) =>
      throwAPIError({
        message: 'Something went wrong during body.json',
        details: {
          method,
          path,
          statusCode,
          headers: currentHeaders,
          ...(body ? { body } : {}),
          cause: error,
        },
        logger,
        errorToBeInitialized,
      }),
    ),
  };
};

export const handleResponse = async <T, R>({
  method,
  path,
  statusCode,
  data,
  statusCodeSchema,
  dataSchema,
  logger,
  errorToBeInitialized,
  options,
}: {
  method: AllowedHTTPMethods;
  path: string;
  statusCodeSchema: z.ZodSchema<R>;
  dataSchema: z.ZodSchema<T>;
  logger?: Logger | undefined;
  errorToBeInitialized: typeof MxmClientError;
  options?: MxmClientRequestOptions | undefined;
} & Response): Promise<T> => {
  logger?.debug(
    {
      fn: handleResponse.name,
      method,
      path,
      statusCode,
      data,
    },
    'Handling response...',
  );

  await validateStatusCode({
    statusCode,
    statusCodeSchema,
    method,
    path,
    logger,
    errorToBeInitialized,
    options,
  });

  return await dataSchema.parseAsync(data).catch((error: ZodError) =>
    throwAPIError({
      message: 'Unexpected response data shape',
      details: {
        method,
        path,
        statusCode,
        data,
        cause: fromError(error),
      },
      logger,
      errorToBeInitialized,
    }),
  );
};

export const handleResponseWithSchema = async <T>({
  method,
  path,
  statusCode,
  data,
  statusCodeSchema,
  responseSchema,
  wrapperSchema,
  logger,
  errorToBeInitialized,
  options,
}: {
  method: AllowedHTTPMethods;
  path: string;
  statusCodeSchema: z.ZodSchema;
  responseSchema: StandardSchemaV1<unknown, T>;
  wrapperSchema: z.ZodSchema;
  logger?: Logger | undefined;
  errorToBeInitialized: typeof MxmClientError;
  options?: MxmClientRequestOptions | undefined;
} & Response): Promise<MxmClientResponse<T>> => {
  logger?.debug(
    {
      fn: handleResponseWithSchema.name,
      method,
      path,
      statusCode,
      data,
    },
    'Handling response with custom schema...',
  );

  await validateStatusCode({
    statusCode,
    statusCodeSchema,
    method,
    path,
    logger,
    errorToBeInitialized,
    options,
  });

  const wrapperResult = await wrapperSchema
    .parseAsync(data)
    .catch((error: ZodError) =>
      throwAPIError({
        message: 'Unexpected response wrapper shape',
        details: {
          method,
          path,
          statusCode,
          data,
          cause: fromError(error),
        },
        logger,
        errorToBeInitialized,
      }),
    );

  const body = (wrapperResult as MxmClientResponse<unknown>).message.body;

  const result = await responseSchema['~standard'].validate(body);

  if (result.issues) {
    return throwAPIError({
      message: 'Unexpected response data shape',
      details: {
        method,
        path,
        statusCode,
        data: body,
        cause: result.issues,
      },
      logger,
      errorToBeInitialized,
    });
  }

  return {
    message: {
      header: (wrapperResult as MxmClientResponse<unknown>).message.header,
      body: result.value,
    },
  };
};

export const validateStatusCode = async ({
  statusCode,
  statusCodeSchema,
  method,
  path,
  logger,
  errorToBeInitialized,
  options,
}: {
  statusCode: number;
  statusCodeSchema: z.ZodSchema;
  method: AllowedHTTPMethods;
  path: string;
  logger?: Logger | undefined;
  errorToBeInitialized: typeof MxmClientError;
  options?: MxmClientRequestOptions | undefined;
}): Promise<void> => {
  if (options?.disableStatusCodeValidation) {
    logger?.debug(
      { fn: validateStatusCode.name, method, path, statusCode },
      'Status code validation skipped',
    );
    return;
  }

  await statusCodeSchema.parseAsync(statusCode).catch((error: ZodError) =>
    throwAPIError({
      message: `Unexpected statusCode, received ${statusCode}`,
      details: {
        method,
        path,
        statusCode,
        cause: fromError(error),
      },
      logger,
      errorToBeInitialized,
    }),
  );
};
