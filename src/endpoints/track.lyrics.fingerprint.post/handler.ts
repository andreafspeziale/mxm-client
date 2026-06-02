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
import { METHOD, TRACK_LYRICS_FINGERPRINT_POST_ENDPOINT } from './constants.js';
import type {
  MxmClientTrackLyricsFingerprintPostResponse,
  TrackLyricsFingerprintPostBody,
  TrackLyricsFingerprintPostQuery,
} from './interfaces.js';
import { mxmClientTrackLyricsFingerprintPostResponseSchema } from './schema.js';

export const trackLyricsFingerprintPost = async ({
  input,
  client,
  logger,
}: EndpointPayload<
  Record<string, never>,
  TrackLyricsFingerprintPostQuery,
  TrackLyricsFingerprintPostBody
>): Promise<MxmClientResponse<MxmClientTrackLyricsFingerprintPostResponse>> => {
  logger?.debug(
    {
      fn: trackLyricsFingerprintPost.name,
      method: METHOD,
      endpoint: TRACK_LYRICS_FINGERPRINT_POST_ENDPOINT,
      input,
    },
    'Performing fingerprint by input text...',
  );

  const path = await buildUrl({
    endpoint: TRACK_LYRICS_FINGERPRINT_POST_ENDPOINT,
    query: input.query!,
    method: METHOD,
    logger,
    errorToBeInitialized: MxmClientError,
  });

  const { statusCode, data } = await handleRequest({
    client: client,
    method: METHOD,
    path,
    body: { data: { text: input.body!.text } },
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
      mxmClientTrackLyricsFingerprintPostResponseSchema,
    ),
    logger,
    errorToBeInitialized: MxmClientError,
  });
};
