import { MxmClientError } from '../../mxm-client.error.js';
import type {
  EndpointPayload,
  MxmClientResponse,
} from '../../mxm-client.interfaces.js';
import {
  buildLegacyAPIResponseSchema,
  successStatusCodeSchema,
} from '../../mxm-client.schemas.js';
import {
  buildUrl,
  handleRequest,
  handleResponse,
} from '../../mxm-client.utils.js';
import { MATCHER_TRACK_GET_ENDPOINT, METHOD } from './constants.js';
import type {
  MatcherTrackGetQuery,
  MxmClientMatcherTrackGetResponse,
} from './interfaces.js';
import { mxmClientMatcherTrackGetResponseSchema } from './schema.js';

export const matcherTrackGet = async ({
  input,
  client,
  logger,
}: EndpointPayload<Record<string, never>, MatcherTrackGetQuery>): Promise<
  MxmClientResponse<MxmClientMatcherTrackGetResponse>
> => {
  logger?.debug(
    {
      fn: matcherTrackGet.name,
      method: METHOD,
      endpoint: MATCHER_TRACK_GET_ENDPOINT,
      input,
    },
    'Getting track by matcher...',
  );

  const path = await buildUrl({
    endpoint: MATCHER_TRACK_GET_ENDPOINT,
    query: input.query!,
    method: METHOD,
    logger,
    errorToBeInitialized: MxmClientError,
  });

  const { statusCode, data } = await handleRequest({
    client: client,
    method: METHOD,
    path,
    logger,
    errorToBeInitialized: MxmClientError,
  });

  return handleResponse({
    method: METHOD,
    path,
    statusCode,
    data,
    statusCodeSchema: successStatusCodeSchema,
    dataSchema: buildLegacyAPIResponseSchema(
      mxmClientMatcherTrackGetResponseSchema,
    ),
    logger,
    errorToBeInitialized: MxmClientError,
  });
};
