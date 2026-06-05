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
import { METHOD, TRACK_LYRICS_GET_ENDPOINT } from './constants.js';
import type {
  MxmClientTrackLyricsGetResponse,
  TrackLyricsGetQuery,
} from './interfaces.js';
import { mxmClientTrackLyricsGetResponseSchema } from './schema.js';

export const trackLyricsGet = async ({
  input,
  client,
  logger,
  options,
}: EndpointPayload<Record<string, never>, TrackLyricsGetQuery>): Promise<
  MxmClientResponse<MxmClientTrackLyricsGetResponse>
> => {
  logger?.debug(
    {
      fn: trackLyricsGet.name,
      method: METHOD,
      endpoint: TRACK_LYRICS_GET_ENDPOINT,
      input,
    },
    'Getting lyrics...',
  );

  const path = await buildUrl({
    endpoint: TRACK_LYRICS_GET_ENDPOINT,
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
      mxmClientTrackLyricsGetResponseSchema,
    ),
    logger,
    errorToBeInitialized: MxmClientError,
    options,
  });
};
