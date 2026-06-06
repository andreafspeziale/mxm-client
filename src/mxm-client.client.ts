import type { StandardSchemaV1 } from '@standard-schema/spec';
import { type Logger, pino } from 'pino';
import { Client } from 'undici';
import type { z } from 'zod';
import type {
  MatcherLyricsGetQuery,
  MxmClientMatcherLyricsGetResponse,
} from './endpoints/matcher.lyrics.get/definition.js';
import {
  MATCHER_LYRICS_GET_ENDPOINT,
  MATCHER_LYRICS_GET_METHOD,
  mxmClientMatcherLyricsGetResponseSchema,
} from './endpoints/matcher.lyrics.get/definition.js';
import type {
  MatcherSubtitleGetQuery,
  MxmClientMatcherSubtitleGetResponse,
} from './endpoints/matcher.subtitle.get/definition.js';
import {
  MATCHER_SUBTITLE_GET_ENDPOINT,
  MATCHER_SUBTITLE_GET_METHOD,
  mxmClientMatcherSubtitleGetResponseSchema,
} from './endpoints/matcher.subtitle.get/definition.js';
import type {
  MatcherTrackGetQuery,
  MxmClientMatcherTrackGetResponse,
} from './endpoints/matcher.track.get/definition.js';
import {
  MATCHER_TRACK_GET_ENDPOINT,
  MATCHER_TRACK_GET_METHOD,
  mxmClientMatcherTrackGetResponseSchema,
} from './endpoints/matcher.track.get/definition.js';
import type {
  MxmClientTrackGetResponse,
  TrackGetQuery,
} from './endpoints/track.get/definition.js';
import {
  mxmClientTrackGetResponseSchema,
  TRACK_GET_ENDPOINT,
  TRACK_GET_METHOD,
} from './endpoints/track.get/definition.js';
import type {
  MxmClientTrackLyricsFingerprintPostResponse,
  TrackLyricsFingerprintPostBody,
  TrackLyricsFingerprintPostQuery,
} from './endpoints/track.lyrics.fingerprint.post/definition.js';
import {
  mxmClientTrackLyricsFingerprintPostResponseSchema,
  TRACK_LYRICS_FINGERPRINT_POST_ENDPOINT,
  TRACK_LYRICS_FINGERPRINT_POST_METHOD,
} from './endpoints/track.lyrics.fingerprint.post/definition.js';
import type {
  MxmClientTrackLyricsGetResponse,
  TrackLyricsGetQuery,
} from './endpoints/track.lyrics.get/definition.js';
import {
  mxmClientTrackLyricsGetResponseSchema,
  TRACK_LYRICS_GET_ENDPOINT,
  TRACK_LYRICS_GET_METHOD,
} from './endpoints/track.lyrics.get/definition.js';
import type {
  MxmClientTrackRichSyncGetResponse,
  TrackRichSyncGetQuery,
} from './endpoints/track.richsync.get/definition.js';
import {
  mxmClientTrackRichSyncGetResponseSchema,
  TRACK_RICHSYNC_GET_ENDPOINT,
  TRACK_RICHSYNC_GET_METHOD,
} from './endpoints/track.richsync.get/definition.js';
import type {
  MxmClientTrackSearchResponse,
  TrackSearchQuery,
} from './endpoints/track.search/definition.js';
import {
  mxmClientTrackSearchResponseSchema,
  TRACK_SEARCH_ENDPOINT,
  TRACK_SEARCH_METHOD,
} from './endpoints/track.search/definition.js';
import type {
  MxmClientTrackSubtitleGetResponse,
  TrackSubtitleGetQuery,
} from './endpoints/track.subtitle.get/definition.js';
import {
  mxmClientTrackSubtitleGetResponseSchema,
  TRACK_SUBTITLE_GET_ENDPOINT,
  TRACK_SUBTITLE_GET_METHOD,
} from './endpoints/track.subtitle.get/definition.js';
import { MUSIXMATCH_BASE_URL } from './mxm-client.constants.js';
import { MxmClientError } from './mxm-client.error.js';
import type {
  AllowedHTTPMethods,
  MxmClientConfig,
  MxmClientOptionalAPIKey,
  MxmClientRequestOptions,
  MxmClientRequestOptionsWithSchema,
  MxmClientResponse,
} from './mxm-client.interfaces.js';
import {
  buildLegacyAPIResponseSchema,
  legacyResponseWrapperSchema,
  successStatusCodeSchema,
} from './mxm-client.schemas.js';
import { MxmClientUnsafe } from './mxm-client.unsafe.js';
import {
  buildUrl,
  handleRequest,
  handleResponse,
  handleResponseWithSchema,
} from './mxm-client.utils.js';

export class MxmClient {
  private readonly client: Client;
  private readonly config?: MxmClientConfig;
  private readonly logger?: Logger;
  private _unsafe?: MxmClientUnsafe;

  constructor({
    config,
    logger,
  }: {
    config?: MxmClientConfig;
    logger?: Logger;
  }) {
    this.client = new Client(
      config?.baseUrl?.replace(/\/+$/, '') ?? MUSIXMATCH_BASE_URL,
    );

    if (config) {
      this.config = config;

      if (this.config.enableLog) {
        if (logger) {
          this.logger =
            typeof logger.child === 'function'
              ? logger.child({ context: MxmClient.name })
              : logger;
        } else {
          this.logger = this.config.defaultLoggerConfig
            ? pino(this.config.defaultLoggerConfig).child({
                context: MxmClient.name,
              })
            : pino().child({ context: MxmClient.name });
        }
      }
    }
  }

  private resolveOptions(
    perRequest?: MxmClientRequestOptions,
  ): MxmClientRequestOptions {
    return {
      disableStatusCodeValidation:
        perRequest?.disableStatusCodeValidation ??
        this.config?.disableStatusCodeValidation ??
        false,
    };
  }

  private async execute<TResponse>({
    endpoint,
    method,
    query,
    body,
    dataSchema,
    options,
  }: {
    endpoint: string;
    method: AllowedHTTPMethods;
    query: object;
    body?: unknown;
    dataSchema: z.ZodSchema;
    options?:
      | MxmClientRequestOptions
      | MxmClientRequestOptionsWithSchema
      | undefined;
  }): Promise<MxmClientResponse<TResponse>> {
    const queryRecord = query as Record<string, unknown>;
    const resolvedQuery = {
      ...queryRecord,
      apiKey:
        (queryRecord['apiKey'] as string | undefined) ?? this.config?.apiKey,
    } as Record<string, string>;

    const path = await buildUrl({
      endpoint,
      query: resolvedQuery,
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

    if (options && 'responseSchema' in options) {
      return handleResponseWithSchema({
        method,
        path,
        statusCode,
        data,
        statusCodeSchema: successStatusCodeSchema,
        responseSchema: options.responseSchema as StandardSchemaV1<
          unknown,
          TResponse
        >,
        wrapperSchema: legacyResponseWrapperSchema,
        logger: this.logger,
        errorToBeInitialized: MxmClientError,
        options: this.resolveOptions(options),
      });
    }

    return handleResponse({
      method,
      path,
      statusCode,
      data,
      statusCodeSchema: successStatusCodeSchema,
      dataSchema: dataSchema as z.ZodSchema<MxmClientResponse<TResponse>>,
      logger: this.logger,
      errorToBeInitialized: MxmClientError,
      options: this.resolveOptions(options),
    });
  }

  get unsafe(): MxmClientUnsafe {
    if (!this._unsafe) {
      this._unsafe = new MxmClientUnsafe(
        this.client,
        this.config?.apiKey,
        this.logger,
        this.resolveOptions(),
      );
    }

    return this._unsafe;
  }

  // --- matcherLyricsGet ---

  async matcherLyricsGet<
    TQuery extends MatcherLyricsGetQuery = MatcherLyricsGetQuery,
  >(input: {
    query: TQuery & MxmClientOptionalAPIKey;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<MxmClientMatcherLyricsGetResponse>>;

  async matcherLyricsGet<
    TQuery extends MatcherLyricsGetQuery,
    TSchema extends StandardSchemaV1,
  >(input: {
    query: TQuery & MxmClientOptionalAPIKey;
    options: MxmClientRequestOptionsWithSchema<TSchema>;
  }): Promise<MxmClientResponse<StandardSchemaV1.InferOutput<TSchema>>>;

  async matcherLyricsGet(input: {
    query: MatcherLyricsGetQuery & MxmClientOptionalAPIKey;
    options?: MxmClientRequestOptions | MxmClientRequestOptionsWithSchema;
  }): Promise<MxmClientResponse<unknown>> {
    return this.execute({
      endpoint: MATCHER_LYRICS_GET_ENDPOINT,
      method: MATCHER_LYRICS_GET_METHOD,
      query: input.query,
      dataSchema: buildLegacyAPIResponseSchema(
        mxmClientMatcherLyricsGetResponseSchema,
      ),
      options: input.options,
    });
  }

  // --- matcherSubtitleGet ---

  async matcherSubtitleGet<
    TQuery extends MatcherSubtitleGetQuery = MatcherSubtitleGetQuery,
  >(input: {
    query: TQuery & MxmClientOptionalAPIKey;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<MxmClientMatcherSubtitleGetResponse>>;

  async matcherSubtitleGet<
    TQuery extends MatcherSubtitleGetQuery,
    TSchema extends StandardSchemaV1,
  >(input: {
    query: TQuery & MxmClientOptionalAPIKey;
    options: MxmClientRequestOptionsWithSchema<TSchema>;
  }): Promise<MxmClientResponse<StandardSchemaV1.InferOutput<TSchema>>>;

  async matcherSubtitleGet(input: {
    query: MatcherSubtitleGetQuery & MxmClientOptionalAPIKey;
    options?: MxmClientRequestOptions | MxmClientRequestOptionsWithSchema;
  }): Promise<MxmClientResponse<unknown>> {
    return this.execute({
      endpoint: MATCHER_SUBTITLE_GET_ENDPOINT,
      method: MATCHER_SUBTITLE_GET_METHOD,
      query: input.query,
      dataSchema: buildLegacyAPIResponseSchema(
        mxmClientMatcherSubtitleGetResponseSchema,
      ),
      options: input.options,
    });
  }

  // --- matcherTrackGet ---

  async matcherTrackGet<
    TQuery extends MatcherTrackGetQuery = MatcherTrackGetQuery,
  >(input: {
    query: TQuery & MxmClientOptionalAPIKey;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<MxmClientMatcherTrackGetResponse>>;

  async matcherTrackGet<
    TQuery extends MatcherTrackGetQuery,
    TSchema extends StandardSchemaV1,
  >(input: {
    query: TQuery & MxmClientOptionalAPIKey;
    options: MxmClientRequestOptionsWithSchema<TSchema>;
  }): Promise<MxmClientResponse<StandardSchemaV1.InferOutput<TSchema>>>;

  async matcherTrackGet(input: {
    query: MatcherTrackGetQuery & MxmClientOptionalAPIKey;
    options?: MxmClientRequestOptions | MxmClientRequestOptionsWithSchema;
  }): Promise<MxmClientResponse<unknown>> {
    return this.execute({
      endpoint: MATCHER_TRACK_GET_ENDPOINT,
      method: MATCHER_TRACK_GET_METHOD,
      query: input.query,
      dataSchema: buildLegacyAPIResponseSchema(
        mxmClientMatcherTrackGetResponseSchema,
      ),
      options: input.options,
    });
  }

  // --- trackGet ---

  async trackGet<TQuery extends TrackGetQuery = TrackGetQuery>(input: {
    query: TQuery & MxmClientOptionalAPIKey;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<MxmClientTrackGetResponse>>;

  async trackGet<
    TQuery extends TrackGetQuery,
    TSchema extends StandardSchemaV1,
  >(input: {
    query: TQuery & MxmClientOptionalAPIKey;
    options: MxmClientRequestOptionsWithSchema<TSchema>;
  }): Promise<MxmClientResponse<StandardSchemaV1.InferOutput<TSchema>>>;

  async trackGet(input: {
    query: TrackGetQuery & MxmClientOptionalAPIKey;
    options?: MxmClientRequestOptions | MxmClientRequestOptionsWithSchema;
  }): Promise<MxmClientResponse<unknown>> {
    return this.execute({
      endpoint: TRACK_GET_ENDPOINT,
      method: TRACK_GET_METHOD,
      query: input.query,
      dataSchema: buildLegacyAPIResponseSchema(mxmClientTrackGetResponseSchema),
      options: input.options,
    });
  }

  // --- trackLyricsGet ---

  async trackLyricsGet<
    TQuery extends TrackLyricsGetQuery = TrackLyricsGetQuery,
  >(input: {
    query: TQuery & MxmClientOptionalAPIKey;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<MxmClientTrackLyricsGetResponse>>;

  async trackLyricsGet<
    TQuery extends TrackLyricsGetQuery,
    TSchema extends StandardSchemaV1,
  >(input: {
    query: TQuery & MxmClientOptionalAPIKey;
    options: MxmClientRequestOptionsWithSchema<TSchema>;
  }): Promise<MxmClientResponse<StandardSchemaV1.InferOutput<TSchema>>>;

  async trackLyricsGet(input: {
    query: TrackLyricsGetQuery & MxmClientOptionalAPIKey;
    options?: MxmClientRequestOptions | MxmClientRequestOptionsWithSchema;
  }): Promise<MxmClientResponse<unknown>> {
    return this.execute({
      endpoint: TRACK_LYRICS_GET_ENDPOINT,
      method: TRACK_LYRICS_GET_METHOD,
      query: input.query,
      dataSchema: buildLegacyAPIResponseSchema(
        mxmClientTrackLyricsGetResponseSchema,
      ),
      options: input.options,
    });
  }

  // --- trackSubtitleGet ---

  async trackSubtitleGet<
    TQuery extends TrackSubtitleGetQuery = TrackSubtitleGetQuery,
  >(input: {
    query: TQuery & MxmClientOptionalAPIKey;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<MxmClientTrackSubtitleGetResponse>>;

  async trackSubtitleGet<
    TQuery extends TrackSubtitleGetQuery,
    TSchema extends StandardSchemaV1,
  >(input: {
    query: TQuery & MxmClientOptionalAPIKey;
    options: MxmClientRequestOptionsWithSchema<TSchema>;
  }): Promise<MxmClientResponse<StandardSchemaV1.InferOutput<TSchema>>>;

  async trackSubtitleGet(input: {
    query: TrackSubtitleGetQuery & MxmClientOptionalAPIKey;
    options?: MxmClientRequestOptions | MxmClientRequestOptionsWithSchema;
  }): Promise<MxmClientResponse<unknown>> {
    return this.execute({
      endpoint: TRACK_SUBTITLE_GET_ENDPOINT,
      method: TRACK_SUBTITLE_GET_METHOD,
      query: input.query,
      dataSchema: buildLegacyAPIResponseSchema(
        mxmClientTrackSubtitleGetResponseSchema,
      ),
      options: input.options,
    });
  }

  // --- trackRichSyncGet ---

  async trackRichSyncGet<
    TQuery extends TrackRichSyncGetQuery = TrackRichSyncGetQuery,
  >(input: {
    query: TQuery & MxmClientOptionalAPIKey;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<MxmClientTrackRichSyncGetResponse>>;

  async trackRichSyncGet<
    TQuery extends TrackRichSyncGetQuery,
    TSchema extends StandardSchemaV1,
  >(input: {
    query: TQuery & MxmClientOptionalAPIKey;
    options: MxmClientRequestOptionsWithSchema<TSchema>;
  }): Promise<MxmClientResponse<StandardSchemaV1.InferOutput<TSchema>>>;

  async trackRichSyncGet(input: {
    query: TrackRichSyncGetQuery & MxmClientOptionalAPIKey;
    options?: MxmClientRequestOptions | MxmClientRequestOptionsWithSchema;
  }): Promise<MxmClientResponse<unknown>> {
    return this.execute({
      endpoint: TRACK_RICHSYNC_GET_ENDPOINT,
      method: TRACK_RICHSYNC_GET_METHOD,
      query: input.query,
      dataSchema: buildLegacyAPIResponseSchema(
        mxmClientTrackRichSyncGetResponseSchema,
      ),
      options: input.options,
    });
  }

  // --- trackSearch ---

  async trackSearch<TQuery extends TrackSearchQuery = TrackSearchQuery>(input: {
    query: TQuery & MxmClientOptionalAPIKey;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<MxmClientTrackSearchResponse>>;

  async trackSearch<
    TQuery extends TrackSearchQuery,
    TSchema extends StandardSchemaV1,
  >(input: {
    query: TQuery & MxmClientOptionalAPIKey;
    options: MxmClientRequestOptionsWithSchema<TSchema>;
  }): Promise<MxmClientResponse<StandardSchemaV1.InferOutput<TSchema>>>;

  async trackSearch(input: {
    query: TrackSearchQuery & MxmClientOptionalAPIKey;
    options?: MxmClientRequestOptions | MxmClientRequestOptionsWithSchema;
  }): Promise<MxmClientResponse<unknown>> {
    return this.execute({
      endpoint: TRACK_SEARCH_ENDPOINT,
      method: TRACK_SEARCH_METHOD,
      query: input.query,
      dataSchema: buildLegacyAPIResponseSchema(
        mxmClientTrackSearchResponseSchema,
      ),
      options: input.options,
    });
  }

  // --- trackLyricsFingerprintPost ---

  async trackLyricsFingerprintPost<
    TQuery extends
      TrackLyricsFingerprintPostQuery = TrackLyricsFingerprintPostQuery,
    TBody extends
      TrackLyricsFingerprintPostBody = TrackLyricsFingerprintPostBody,
  >(input: {
    query?: TQuery & MxmClientOptionalAPIKey;
    body: TBody;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<MxmClientTrackLyricsFingerprintPostResponse>>;

  async trackLyricsFingerprintPost<
    TQuery extends TrackLyricsFingerprintPostQuery,
    TBody extends TrackLyricsFingerprintPostBody,
    TSchema extends StandardSchemaV1,
  >(input: {
    query?: TQuery & MxmClientOptionalAPIKey;
    body: TBody;
    options: MxmClientRequestOptionsWithSchema<TSchema>;
  }): Promise<MxmClientResponse<StandardSchemaV1.InferOutput<TSchema>>>;

  async trackLyricsFingerprintPost(input: {
    query?: TrackLyricsFingerprintPostQuery & MxmClientOptionalAPIKey;
    body: TrackLyricsFingerprintPostBody;
    options?: MxmClientRequestOptions | MxmClientRequestOptionsWithSchema;
  }): Promise<MxmClientResponse<unknown>> {
    return this.execute({
      endpoint: TRACK_LYRICS_FINGERPRINT_POST_ENDPOINT,
      method: TRACK_LYRICS_FINGERPRINT_POST_METHOD,
      query: input.query ?? {},
      body: { data: { text: input.body.text } },
      dataSchema: buildLegacyAPIResponseSchema(
        mxmClientTrackLyricsFingerprintPostResponseSchema,
      ),
      options: input.options,
    });
  }
}
