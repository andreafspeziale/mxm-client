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
import { METHOD, TRACK_SEARCH_ENDPOINT } from './constants.js';
import type {
  MxmClientTrackSearchResponse,
  TrackSearchQuery,
} from './interfaces.js';
import { mxmClientTrackSearchResponseSchema } from './schema.js';

export const trackSearch = async ({
  input,
  client,
  logger,
  options,
}: EndpointPayload<Record<string, never>, TrackSearchQuery>): Promise<
  MxmClientResponse<MxmClientTrackSearchResponse>
> => {
  logger?.debug(
    {
      fn: trackSearch.name,
      method: METHOD,
      endpoint: TRACK_SEARCH_ENDPOINT,
      input,
    },
    'Searching track...',
  );

  const path = await buildUrl({
    endpoint: TRACK_SEARCH_ENDPOINT,
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
      mxmClientTrackSearchResponseSchema,
    ),
    logger,
    errorToBeInitialized: MxmClientError,
    options,
  });
};
