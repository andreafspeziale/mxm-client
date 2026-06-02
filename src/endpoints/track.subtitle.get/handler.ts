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
import { METHOD, TRACK_SUBTITLE_GET_ENDPOINT } from './constants.js';
import type {
  MxmClientTrackSubtitleGetResponse,
  TrackSubtitleGetQuery,
} from './interfaces.js';
import { mxmClientTrackSubtitleGetResponse } from './schema.js';

export const trackSubtitleGet = async ({
  input,
  client,
  logger,
}: EndpointPayload<Record<string, never>, TrackSubtitleGetQuery>): Promise<
  MxmClientResponse<MxmClientTrackSubtitleGetResponse>
> => {
  logger?.debug(
    {
      fn: trackSubtitleGet.name,
      method: METHOD,
      endpoint: TRACK_SUBTITLE_GET_ENDPOINT,
      input,
    },
    'Getting subtitle...',
  );

  const path = await buildUrl({
    endpoint: TRACK_SUBTITLE_GET_ENDPOINT,
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
    dataSchema: buildLegacyAPIResponseSchema(mxmClientTrackSubtitleGetResponse),
    logger,
    errorToBeInitialized: MxmClientError,
  });
};
