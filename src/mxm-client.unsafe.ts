import type { Logger } from 'pino';
import type { Client } from 'undici';
import {
  MATCHER_LYRICS_GET_ENDPOINT,
  METHOD as MATCHER_LYRICS_GET_METHOD,
} from './endpoints/matcher.lyrics.get/constants.js';
import type {
  MatcherLyricsGetQuery,
  MxmClientMatcherLyricsGetResponse,
} from './endpoints/matcher.lyrics.get/index.js';
import {
  MATCHER_SUBTITLE_GET_ENDPOINT,
  METHOD as MATCHER_SUBTITLE_GET_METHOD,
} from './endpoints/matcher.subtitle.get/constants.js';
import type {
  MatcherSubtitleGetQuery,
  MxmClientMatcherSubtitleGetResponse,
} from './endpoints/matcher.subtitle.get/index.js';
import {
  MATCHER_TRACK_GET_ENDPOINT,
  METHOD as MATCHER_TRACK_GET_METHOD,
} from './endpoints/matcher.track.get/constants.js';
import type {
  MatcherTrackGetQuery,
  MxmClientMatcherTrackGetResponse,
} from './endpoints/matcher.track.get/index.js';
import {
  TRACK_GET_ENDPOINT,
  METHOD as TRACK_GET_METHOD,
} from './endpoints/track.get/constants.js';
import type {
  MxmClientTrackGetResponse,
  TrackGetQuery,
} from './endpoints/track.get/index.js';
import {
  TRACK_LYRICS_FINGERPRINT_POST_ENDPOINT,
  METHOD as TRACK_LYRICS_FINGERPRINT_POST_METHOD,
} from './endpoints/track.lyrics.fingerprint.post/constants.js';
import type {
  MxmClientTrackLyricsFingerprintPostResponse,
  TrackLyricsFingerprintPostBody,
  TrackLyricsFingerprintPostQuery,
} from './endpoints/track.lyrics.fingerprint.post/index.js';
import {
  TRACK_LYRICS_GET_ENDPOINT,
  METHOD as TRACK_LYRICS_GET_METHOD,
} from './endpoints/track.lyrics.get/constants.js';
import type {
  MxmClientTrackLyricsGetResponse,
  TrackLyricsGetQuery,
} from './endpoints/track.lyrics.get/index.js';
import {
  TRACK_RICH_SYNC_GET_ENDPOINT,
  METHOD as TRACK_RICHSYNC_GET_METHOD,
} from './endpoints/track.richsync.get/constants.js';
import type {
  MxmClientTrackRichSyncGetResponse,
  TrackRichSyncGetQuery,
} from './endpoints/track.richsync.get/index.js';
import {
  TRACK_SEARCH_ENDPOINT,
  METHOD as TRACK_SEARCH_METHOD,
} from './endpoints/track.search/constants.js';
import type {
  MxmClientTrackSearchResponse,
  TrackSearchQuery,
} from './endpoints/track.search/index.js';
import {
  TRACK_SUBTITLE_GET_ENDPOINT,
  METHOD as TRACK_SUBTITLE_GET_METHOD,
} from './endpoints/track.subtitle.get/constants.js';
import type {
  MxmClientTrackSubtitleGetResponse,
  TrackSubtitleGetQuery,
} from './endpoints/track.subtitle.get/index.js';
import { MxmClientError } from './mxm-client.error.js';
import type {
  AllowedHTTPMethods,
  MxmClientRequestOptions,
  MxmClientResponse,
} from './mxm-client.interfaces.js';
import { successStatusCodeSchema } from './mxm-client.schemas.js';
import {
  buildUrl,
  handleRequest,
  validateStatusCode,
} from './mxm-client.utils.js';

export class MxmClientUnsafe {
  constructor(
    private readonly client: Client,
    private readonly apiKey: string | undefined,
    private readonly logger: Logger | undefined,
    private readonly defaultOptions: MxmClientRequestOptions,
  ) {}

  private resolveOptions(
    perRequest?: MxmClientRequestOptions,
  ): MxmClientRequestOptions {
    return {
      disableStatusCodeValidation:
        perRequest?.disableStatusCodeValidation ??
        this.defaultOptions.disableStatusCodeValidation ??
        false,
    };
  }

  private async execute<TResponse>({
    endpoint,
    method,
    query,
    body,
    options,
  }: {
    endpoint: string;
    method: AllowedHTTPMethods;
    query: Record<string, unknown>;
    body?: unknown;
    options?: MxmClientRequestOptions | undefined;
  }): Promise<MxmClientResponse<TResponse>> {
    const path = await buildUrl({
      endpoint,
      query: query as Record<string, string>,
      method,
      logger: this.logger,
      errorToBeInitialized: MxmClientError,
    });

    const { statusCode, data } = await handleRequest({
      client: this.client,
      method,
      path,
      ...(body ? { body } : {}),
      logger: this.logger,
      errorToBeInitialized: MxmClientError,
    });

    await validateStatusCode({
      statusCode,
      statusCodeSchema: successStatusCodeSchema,
      method,
      path,
      logger: this.logger,
      errorToBeInitialized: MxmClientError,
      options: this.resolveOptions(options),
    });

    return data as MxmClientResponse<TResponse>;
  }

  async matcherLyricsGet<
    TQuery extends MatcherLyricsGetQuery = MatcherLyricsGetQuery,
    TResponse extends
      MxmClientMatcherLyricsGetResponse = MxmClientMatcherLyricsGetResponse,
  >(input: {
    query: TQuery & { apiKey?: never };
    apiKey?: string;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<TResponse>> {
    return this.execute<TResponse>({
      endpoint: MATCHER_LYRICS_GET_ENDPOINT,
      method: MATCHER_LYRICS_GET_METHOD,
      query: { ...input.query, apiKey: input.apiKey || this.apiKey },
      options: input.options,
    });
  }

  async matcherSubtitleGet<
    TQuery extends MatcherSubtitleGetQuery = MatcherSubtitleGetQuery,
    TResponse extends
      MxmClientMatcherSubtitleGetResponse = MxmClientMatcherSubtitleGetResponse,
  >(input: {
    query: TQuery & { apiKey?: never };
    apiKey?: string;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<TResponse>> {
    return this.execute<TResponse>({
      endpoint: MATCHER_SUBTITLE_GET_ENDPOINT,
      method: MATCHER_SUBTITLE_GET_METHOD,
      query: { ...input.query, apiKey: input.apiKey || this.apiKey },
      options: input.options,
    });
  }

  async matcherTrackGet<
    TQuery extends MatcherTrackGetQuery = MatcherTrackGetQuery,
    TResponse extends
      MxmClientMatcherTrackGetResponse = MxmClientMatcherTrackGetResponse,
  >(input: {
    query: TQuery & { apiKey?: never };
    apiKey?: string;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<TResponse>> {
    return this.execute<TResponse>({
      endpoint: MATCHER_TRACK_GET_ENDPOINT,
      method: MATCHER_TRACK_GET_METHOD,
      query: { ...input.query, apiKey: input.apiKey || this.apiKey },
      options: input.options,
    });
  }

  async trackGet<
    TQuery extends TrackGetQuery = TrackGetQuery,
    TResponse extends MxmClientTrackGetResponse = MxmClientTrackGetResponse,
  >(input: {
    query: TQuery & { apiKey?: never };
    apiKey?: string;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<TResponse>> {
    return this.execute<TResponse>({
      endpoint: TRACK_GET_ENDPOINT,
      method: TRACK_GET_METHOD,
      query: { ...input.query, apiKey: input.apiKey || this.apiKey },
      options: input.options,
    });
  }

  async trackLyricsGet<
    TQuery extends TrackLyricsGetQuery = TrackLyricsGetQuery,
    TResponse extends
      MxmClientTrackLyricsGetResponse = MxmClientTrackLyricsGetResponse,
  >(input: {
    query: TQuery & { apiKey?: never };
    apiKey?: string;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<TResponse>> {
    return this.execute<TResponse>({
      endpoint: TRACK_LYRICS_GET_ENDPOINT,
      method: TRACK_LYRICS_GET_METHOD,
      query: { ...input.query, apiKey: input.apiKey || this.apiKey },
      options: input.options,
    });
  }

  async trackSubtitleGet<
    TQuery extends TrackSubtitleGetQuery = TrackSubtitleGetQuery,
    TResponse extends
      MxmClientTrackSubtitleGetResponse = MxmClientTrackSubtitleGetResponse,
  >(input: {
    query: TQuery & { apiKey?: never };
    apiKey?: string;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<TResponse>> {
    return this.execute<TResponse>({
      endpoint: TRACK_SUBTITLE_GET_ENDPOINT,
      method: TRACK_SUBTITLE_GET_METHOD,
      query: { ...input.query, apiKey: input.apiKey || this.apiKey },
      options: input.options,
    });
  }

  async trackRichSyncGet<
    TQuery extends TrackRichSyncGetQuery = TrackRichSyncGetQuery,
    TResponse extends
      MxmClientTrackRichSyncGetResponse = MxmClientTrackRichSyncGetResponse,
  >(input: {
    query: TQuery & { apiKey?: never };
    apiKey?: string;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<TResponse>> {
    return this.execute<TResponse>({
      endpoint: TRACK_RICH_SYNC_GET_ENDPOINT,
      method: TRACK_RICHSYNC_GET_METHOD,
      query: { ...input.query, apiKey: input.apiKey || this.apiKey },
      options: input.options,
    });
  }

  async trackSearch<
    TQuery extends TrackSearchQuery = TrackSearchQuery,
    TResponse extends
      MxmClientTrackSearchResponse = MxmClientTrackSearchResponse,
  >(input: {
    query: TQuery & { apiKey?: never };
    apiKey?: string;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<TResponse>> {
    return this.execute<TResponse>({
      endpoint: TRACK_SEARCH_ENDPOINT,
      method: TRACK_SEARCH_METHOD,
      query: { ...input.query, apiKey: input.apiKey || this.apiKey },
      options: input.options,
    });
  }

  async trackLyricsFingerprintPost<
    TQuery extends
      TrackLyricsFingerprintPostQuery = TrackLyricsFingerprintPostQuery,
    TBody extends
      TrackLyricsFingerprintPostBody = TrackLyricsFingerprintPostBody,
    TResponse extends
      MxmClientTrackLyricsFingerprintPostResponse = MxmClientTrackLyricsFingerprintPostResponse,
  >(input: {
    query?: TQuery & { apiKey?: never };
    body: TBody;
    apiKey?: string;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<TResponse>> {
    return this.execute<TResponse>({
      endpoint: TRACK_LYRICS_FINGERPRINT_POST_ENDPOINT,
      method: TRACK_LYRICS_FINGERPRINT_POST_METHOD,
      query: { ...input.query, apiKey: input.apiKey || this.apiKey },
      body: { data: { text: input.body.text } },
      options: input.options,
    });
  }
}
