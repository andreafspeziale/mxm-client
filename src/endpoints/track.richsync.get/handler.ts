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
import { METHOD, TRACK_RICH_SYNC_GET_ENDPOINT } from './constants.js';
import type {
  MxmClientTrackRichSyncGetResponse,
  TrackRichSyncGetQuery,
} from './interfaces.js';
import { mxmClientTrackRichSyncGetResponseSchema } from './schema.js';

export const trackRichSyncGet = async ({
  input,
  client,
  logger,
  options,
}: EndpointPayload<Record<string, never>, TrackRichSyncGetQuery>): Promise<
  MxmClientResponse<MxmClientTrackRichSyncGetResponse>
> => {
  logger?.debug(
    {
      fn: trackRichSyncGet.name,
      method: METHOD,
      endpoint: TRACK_RICH_SYNC_GET_ENDPOINT,
      input,
    },
    'Getting richsync...',
  );

  const path = await buildUrl({
    endpoint: TRACK_RICH_SYNC_GET_ENDPOINT,
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
      mxmClientTrackRichSyncGetResponseSchema,
    ),
    logger,
    errorToBeInitialized: MxmClientError,
    options,
  });
};
