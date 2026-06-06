import type { StandardSchemaV1 } from '@standard-schema/spec';
import { type Logger, pino } from 'pino';
import { Client } from 'undici';
import type { z } from 'zod';
import {
  MATCHER_LYRICS_GET_ENDPOINT,
  METHOD as MATCHER_LYRICS_GET_METHOD,
} from './endpoints/matcher.lyrics.get/constants.js';
import type {
  MatcherLyricsGetQuery,
  MxmClientMatcherLyricsGetResponse,
} from './endpoints/matcher.lyrics.get/index.js';
import { mxmClientMatcherLyricsGetResponseSchema } from './endpoints/matcher.lyrics.get/schema.js';
import {
  MATCHER_SUBTITLE_GET_ENDPOINT,
  METHOD as MATCHER_SUBTITLE_GET_METHOD,
} from './endpoints/matcher.subtitle.get/constants.js';
import type {
  MatcherSubtitleGetQuery,
  MxmClientMatcherSubtitleGetResponse,
} from './endpoints/matcher.subtitle.get/index.js';
import { mxmClientMatcherSubtitleGetResponseSchema } from './endpoints/matcher.subtitle.get/schema.js';
import {
  MATCHER_TRACK_GET_ENDPOINT,
  METHOD as MATCHER_TRACK_GET_METHOD,
} from './endpoints/matcher.track.get/constants.js';
import type {
  MatcherTrackGetQuery,
  MxmClientMatcherTrackGetResponse,
} from './endpoints/matcher.track.get/index.js';
import { mxmClientMatcherTrackGetResponseSchema } from './endpoints/matcher.track.get/schema.js';
import {
  TRACK_GET_ENDPOINT,
  METHOD as TRACK_GET_METHOD,
} from './endpoints/track.get/constants.js';
import type {
  MxmClientTrackGetResponse,
  TrackGetQuery,
} from './endpoints/track.get/index.js';
import { mxmClientTrackGetResponseSchema } from './endpoints/track.get/schema.js';
import {
  TRACK_LYRICS_FINGERPRINT_POST_ENDPOINT,
  METHOD as TRACK_LYRICS_FINGERPRINT_POST_METHOD,
} from './endpoints/track.lyrics.fingerprint.post/constants.js';
import type {
  MxmClientTrackLyricsFingerprintPostResponse,
  TrackLyricsFingerprintPostBody,
  TrackLyricsFingerprintPostQuery,
} from './endpoints/track.lyrics.fingerprint.post/index.js';
import { mxmClientTrackLyricsFingerprintPostResponseSchema } from './endpoints/track.lyrics.fingerprint.post/schema.js';
import {
  TRACK_LYRICS_GET_ENDPOINT,
  METHOD as TRACK_LYRICS_GET_METHOD,
} from './endpoints/track.lyrics.get/constants.js';
import type {
  MxmClientTrackLyricsGetResponse,
  TrackLyricsGetQuery,
} from './endpoints/track.lyrics.get/index.js';
import { mxmClientTrackLyricsGetResponseSchema } from './endpoints/track.lyrics.get/schema.js';
import {
  TRACK_RICH_SYNC_GET_ENDPOINT,
  METHOD as TRACK_RICHSYNC_GET_METHOD,
} from './endpoints/track.richsync.get/constants.js';
import type {
  MxmClientTrackRichSyncGetResponse,
  TrackRichSyncGetQuery,
} from './endpoints/track.richsync.get/index.js';
import { mxmClientTrackRichSyncGetResponseSchema } from './endpoints/track.richsync.get/schema.js';
import {
  TRACK_SEARCH_ENDPOINT,
  METHOD as TRACK_SEARCH_METHOD,
} from './endpoints/track.search/constants.js';
import type {
  MxmClientTrackSearchResponse,
  TrackSearchQuery,
} from './endpoints/track.search/index.js';
import { mxmClientTrackSearchResponseSchema } from './endpoints/track.search/schema.js';
import {
  TRACK_SUBTITLE_GET_ENDPOINT,
  METHOD as TRACK_SUBTITLE_GET_METHOD,
} from './endpoints/track.subtitle.get/constants.js';
import type {
  MxmClientTrackSubtitleGetResponse,
  TrackSubtitleGetQuery,
} from './endpoints/track.subtitle.get/index.js';
import { mxmClientTrackSubtitleGetResponseSchema } from './endpoints/track.subtitle.get/schema.js';
import { MUSIXMATCH_BASE_URL } from './mxm-client.constants.js';
import { MxmClientError } from './mxm-client.error.js';
import type {
  AllowedHTTPMethods,
  MxmClientConfig,
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
    query: Record<string, unknown>;
    body?: unknown;
    dataSchema: z.ZodSchema;
    options?:
      | MxmClientRequestOptions
      | MxmClientRequestOptionsWithSchema
      | undefined;
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
    query: TQuery & { apiKey?: never };
    apiKey?: string;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<MxmClientMatcherLyricsGetResponse>>;

  async matcherLyricsGet<
    TQuery extends MatcherLyricsGetQuery,
    TSchema extends StandardSchemaV1,
  >(input: {
    query: TQuery & { apiKey?: never };
    apiKey?: string;
    options: MxmClientRequestOptionsWithSchema<TSchema>;
  }): Promise<MxmClientResponse<StandardSchemaV1.InferOutput<TSchema>>>;

  async matcherLyricsGet(input: {
    query: MatcherLyricsGetQuery & { apiKey?: never };
    apiKey?: string;
    options?: MxmClientRequestOptions | MxmClientRequestOptionsWithSchema;
  }): Promise<MxmClientResponse<unknown>> {
    return this.execute({
      endpoint: MATCHER_LYRICS_GET_ENDPOINT,
      method: MATCHER_LYRICS_GET_METHOD,
      query: { ...input.query, apiKey: input.apiKey || this.config?.apiKey },
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
    query: TQuery & { apiKey?: never };
    apiKey?: string;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<MxmClientMatcherSubtitleGetResponse>>;

  async matcherSubtitleGet<
    TQuery extends MatcherSubtitleGetQuery,
    TSchema extends StandardSchemaV1,
  >(input: {
    query: TQuery & { apiKey?: never };
    apiKey?: string;
    options: MxmClientRequestOptionsWithSchema<TSchema>;
  }): Promise<MxmClientResponse<StandardSchemaV1.InferOutput<TSchema>>>;

  async matcherSubtitleGet(input: {
    query: MatcherSubtitleGetQuery & { apiKey?: never };
    apiKey?: string;
    options?: MxmClientRequestOptions | MxmClientRequestOptionsWithSchema;
  }): Promise<MxmClientResponse<unknown>> {
    return this.execute({
      endpoint: MATCHER_SUBTITLE_GET_ENDPOINT,
      method: MATCHER_SUBTITLE_GET_METHOD,
      query: { ...input.query, apiKey: input.apiKey || this.config?.apiKey },
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
    query: TQuery & { apiKey?: never };
    apiKey?: string;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<MxmClientMatcherTrackGetResponse>>;

  async matcherTrackGet<
    TQuery extends MatcherTrackGetQuery,
    TSchema extends StandardSchemaV1,
  >(input: {
    query: TQuery & { apiKey?: never };
    apiKey?: string;
    options: MxmClientRequestOptionsWithSchema<TSchema>;
  }): Promise<MxmClientResponse<StandardSchemaV1.InferOutput<TSchema>>>;

  async matcherTrackGet(input: {
    query: MatcherTrackGetQuery & { apiKey?: never };
    apiKey?: string;
    options?: MxmClientRequestOptions | MxmClientRequestOptionsWithSchema;
  }): Promise<MxmClientResponse<unknown>> {
    return this.execute({
      endpoint: MATCHER_TRACK_GET_ENDPOINT,
      method: MATCHER_TRACK_GET_METHOD,
      query: { ...input.query, apiKey: input.apiKey || this.config?.apiKey },
      dataSchema: buildLegacyAPIResponseSchema(
        mxmClientMatcherTrackGetResponseSchema,
      ),
      options: input.options,
    });
  }

  // --- trackGet ---

  async trackGet<TQuery extends TrackGetQuery = TrackGetQuery>(input: {
    query: TQuery & { apiKey?: never };
    apiKey?: string;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<MxmClientTrackGetResponse>>;

  async trackGet<
    TQuery extends TrackGetQuery,
    TSchema extends StandardSchemaV1,
  >(input: {
    query: TQuery & { apiKey?: never };
    apiKey?: string;
    options: MxmClientRequestOptionsWithSchema<TSchema>;
  }): Promise<MxmClientResponse<StandardSchemaV1.InferOutput<TSchema>>>;

  async trackGet(input: {
    query: TrackGetQuery & { apiKey?: never };
    apiKey?: string;
    options?: MxmClientRequestOptions | MxmClientRequestOptionsWithSchema;
  }): Promise<MxmClientResponse<unknown>> {
    return this.execute({
      endpoint: TRACK_GET_ENDPOINT,
      method: TRACK_GET_METHOD,
      query: { ...input.query, apiKey: input.apiKey || this.config?.apiKey },
      dataSchema: buildLegacyAPIResponseSchema(mxmClientTrackGetResponseSchema),
      options: input.options,
    });
  }

  // --- trackLyricsGet ---

  async trackLyricsGet<
    TQuery extends TrackLyricsGetQuery = TrackLyricsGetQuery,
  >(input: {
    query: TQuery & { apiKey?: never };
    apiKey?: string;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<MxmClientTrackLyricsGetResponse>>;

  async trackLyricsGet<
    TQuery extends TrackLyricsGetQuery,
    TSchema extends StandardSchemaV1,
  >(input: {
    query: TQuery & { apiKey?: never };
    apiKey?: string;
    options: MxmClientRequestOptionsWithSchema<TSchema>;
  }): Promise<MxmClientResponse<StandardSchemaV1.InferOutput<TSchema>>>;

  async trackLyricsGet(input: {
    query: TrackLyricsGetQuery & { apiKey?: never };
    apiKey?: string;
    options?: MxmClientRequestOptions | MxmClientRequestOptionsWithSchema;
  }): Promise<MxmClientResponse<unknown>> {
    return this.execute({
      endpoint: TRACK_LYRICS_GET_ENDPOINT,
      method: TRACK_LYRICS_GET_METHOD,
      query: { ...input.query, apiKey: input.apiKey || this.config?.apiKey },
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
    query: TQuery & { apiKey?: never };
    apiKey?: string;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<MxmClientTrackSubtitleGetResponse>>;

  async trackSubtitleGet<
    TQuery extends TrackSubtitleGetQuery,
    TSchema extends StandardSchemaV1,
  >(input: {
    query: TQuery & { apiKey?: never };
    apiKey?: string;
    options: MxmClientRequestOptionsWithSchema<TSchema>;
  }): Promise<MxmClientResponse<StandardSchemaV1.InferOutput<TSchema>>>;

  async trackSubtitleGet(input: {
    query: TrackSubtitleGetQuery & { apiKey?: never };
    apiKey?: string;
    options?: MxmClientRequestOptions | MxmClientRequestOptionsWithSchema;
  }): Promise<MxmClientResponse<unknown>> {
    return this.execute({
      endpoint: TRACK_SUBTITLE_GET_ENDPOINT,
      method: TRACK_SUBTITLE_GET_METHOD,
      query: { ...input.query, apiKey: input.apiKey || this.config?.apiKey },
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
    query: TQuery & { apiKey?: never };
    apiKey?: string;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<MxmClientTrackRichSyncGetResponse>>;

  async trackRichSyncGet<
    TQuery extends TrackRichSyncGetQuery,
    TSchema extends StandardSchemaV1,
  >(input: {
    query: TQuery & { apiKey?: never };
    apiKey?: string;
    options: MxmClientRequestOptionsWithSchema<TSchema>;
  }): Promise<MxmClientResponse<StandardSchemaV1.InferOutput<TSchema>>>;

  async trackRichSyncGet(input: {
    query: TrackRichSyncGetQuery & { apiKey?: never };
    apiKey?: string;
    options?: MxmClientRequestOptions | MxmClientRequestOptionsWithSchema;
  }): Promise<MxmClientResponse<unknown>> {
    return this.execute({
      endpoint: TRACK_RICH_SYNC_GET_ENDPOINT,
      method: TRACK_RICHSYNC_GET_METHOD,
      query: { ...input.query, apiKey: input.apiKey || this.config?.apiKey },
      dataSchema: buildLegacyAPIResponseSchema(
        mxmClientTrackRichSyncGetResponseSchema,
      ),
      options: input.options,
    });
  }

  // --- trackSearch ---

  async trackSearch<TQuery extends TrackSearchQuery = TrackSearchQuery>(input: {
    query: TQuery & { apiKey?: never };
    apiKey?: string;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<MxmClientTrackSearchResponse>>;

  async trackSearch<
    TQuery extends TrackSearchQuery,
    TSchema extends StandardSchemaV1,
  >(input: {
    query: TQuery & { apiKey?: never };
    apiKey?: string;
    options: MxmClientRequestOptionsWithSchema<TSchema>;
  }): Promise<MxmClientResponse<StandardSchemaV1.InferOutput<TSchema>>>;

  async trackSearch(input: {
    query: TrackSearchQuery & { apiKey?: never };
    apiKey?: string;
    options?: MxmClientRequestOptions | MxmClientRequestOptionsWithSchema;
  }): Promise<MxmClientResponse<unknown>> {
    return this.execute({
      endpoint: TRACK_SEARCH_ENDPOINT,
      method: TRACK_SEARCH_METHOD,
      query: { ...input.query, apiKey: input.apiKey || this.config?.apiKey },
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
    query?: TQuery & { apiKey?: never };
    body: TBody;
    apiKey?: string;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<MxmClientTrackLyricsFingerprintPostResponse>>;

  async trackLyricsFingerprintPost<
    TQuery extends TrackLyricsFingerprintPostQuery,
    TBody extends TrackLyricsFingerprintPostBody,
    TSchema extends StandardSchemaV1,
  >(input: {
    query?: TQuery & { apiKey?: never };
    body: TBody;
    apiKey?: string;
    options: MxmClientRequestOptionsWithSchema<TSchema>;
  }): Promise<MxmClientResponse<StandardSchemaV1.InferOutput<TSchema>>>;

  async trackLyricsFingerprintPost(input: {
    query?: TrackLyricsFingerprintPostQuery & { apiKey?: never };
    body: TrackLyricsFingerprintPostBody;
    apiKey?: string;
    options?: MxmClientRequestOptions | MxmClientRequestOptionsWithSchema;
  }): Promise<MxmClientResponse<unknown>> {
    return this.execute({
      endpoint: TRACK_LYRICS_FINGERPRINT_POST_ENDPOINT,
      method: TRACK_LYRICS_FINGERPRINT_POST_METHOD,
      query: { ...input.query, apiKey: input.apiKey || this.config?.apiKey },
      body: { data: { text: input.body.text } },
      dataSchema: buildLegacyAPIResponseSchema(
        mxmClientTrackLyricsFingerprintPostResponseSchema,
      ),
      options: input.options,
    });
  }
}
