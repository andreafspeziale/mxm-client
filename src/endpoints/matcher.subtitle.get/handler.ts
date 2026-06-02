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
import { MATCHER_SUBTITLE_GET_ENDPOINT, METHOD } from './constants.js';
import type {
  MatcherSubtitleGetQuery,
  MxmClientMatcherSubtitleGetResponse,
} from './interfaces.js';
import { mxmClientMatcherSubtitleGetResponseSchema } from './schema.js';

export const matcherSubtitleGet = async ({
  input,
  client,
  logger,
}: EndpointPayload<Record<string, never>, MatcherSubtitleGetQuery>): Promise<
  MxmClientResponse<MxmClientMatcherSubtitleGetResponse>
> => {
  logger?.debug(
    {
      fn: matcherSubtitleGet.name,
      method: METHOD,
      endpoint: MATCHER_SUBTITLE_GET_ENDPOINT,
      input,
    },
    'Getting subtitle by matcher...',
  );

  const path = await buildUrl({
    endpoint: MATCHER_SUBTITLE_GET_ENDPOINT,
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
      mxmClientMatcherSubtitleGetResponseSchema,
    ),
    logger,
    errorToBeInitialized: MxmClientError,
  });
};
