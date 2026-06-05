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
import { METHOD, TRACK_GET_ENDPOINT } from './constants.js';
import type { MxmClientTrackGetResponse, TrackGetQuery } from './interfaces.js';
import { mxmClientTrackGetResponseSchema } from './schema.js';

export const trackGet = async ({
  input,
  client,
  logger,
  options,
}: EndpointPayload<Record<string, never>, TrackGetQuery>): Promise<
  MxmClientResponse<MxmClientTrackGetResponse>
> => {
  logger?.debug(
    {
      fn: trackGet.name,
      method: METHOD,
      endpoint: TRACK_GET_ENDPOINT,
      input,
    },
    'Getting track...',
  );

  const path = await buildUrl({
    endpoint: TRACK_GET_ENDPOINT,
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
    dataSchema: buildLegacyAPIResponseSchema(mxmClientTrackGetResponseSchema),
    logger,
    errorToBeInitialized: MxmClientError,
    options,
  });
};
