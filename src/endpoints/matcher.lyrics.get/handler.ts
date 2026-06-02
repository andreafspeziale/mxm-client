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
import { MATCHER_LYRICS_GET_ENDPOINT, METHOD } from './constants.js';
import type {
  MatcherLyricsGetQuery,
  MxmClientMatcherLyricsGetResponse,
} from './interfaces.js';
import { mxmClientMatcherLyricsGetResponseSchema } from './schema.js';

export const matcherLyricsGet = async ({
  input,
  client,
  logger,
}: EndpointPayload<Record<string, never>, MatcherLyricsGetQuery>): Promise<
  MxmClientResponse<MxmClientMatcherLyricsGetResponse>
> => {
  logger?.debug(
    {
      fn: matcherLyricsGet.name,
      method: METHOD,
      endpoint: MATCHER_LYRICS_GET_ENDPOINT,
      input,
    },
    'Getting lyric by matcher...',
  );

  const path = await buildUrl({
    endpoint: MATCHER_LYRICS_GET_ENDPOINT,
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
      mxmClientMatcherLyricsGetResponseSchema,
    ),
    logger,
    errorToBeInitialized: MxmClientError,
  });
};
