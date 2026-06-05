import { type Logger, pino } from 'pino';
import { Client } from 'undici';
import {
  type MatcherLyricsGetQuery,
  type MxmClientMatcherLyricsGetResponse,
  matcherLyricsGet,
} from './endpoints/matcher.lyrics.get/index.js';
import {
  type MatcherSubtitleGetQuery,
  type MxmClientMatcherSubtitleGetResponse,
  matcherSubtitleGet,
} from './endpoints/matcher.subtitle.get/index.js';
import {
  type MatcherTrackGetQuery,
  type MxmClientMatcherTrackGetResponse,
  matcherTrackGet,
} from './endpoints/matcher.track.get/index.js';
import {
  type MxmClientTrackGetResponse,
  type TrackGetQuery,
  trackGet,
} from './endpoints/track.get/index.js';
import {
  type MxmClientTrackLyricsFingerprintPostResponse,
  type TrackLyricsFingerprintPostBody,
  type TrackLyricsFingerprintPostQuery,
  trackLyricsFingerprintPost,
} from './endpoints/track.lyrics.fingerprint.post/index.js';
import {
  type MxmClientTrackLyricsGetResponse,
  type TrackLyricsGetQuery,
  trackLyricsGet,
} from './endpoints/track.lyrics.get/index.js';
import {
  type MxmClientTrackRichSyncGetResponse,
  type TrackRichSyncGetQuery,
  trackRichSyncGet,
} from './endpoints/track.richsync.get/index.js';
import {
  type MxmClientTrackSearchResponse,
  type TrackSearchQuery,
  trackSearch,
} from './endpoints/track.search/index.js';
import {
  type MxmClientTrackSubtitleGetResponse,
  type TrackSubtitleGetQuery,
  trackSubtitleGet,
} from './endpoints/track.subtitle.get/index.js';
import { MUSIXMATCH_BASE_URL } from './mxm-client.constants.js';
import { MxmClientError } from './mxm-client.error.js';
import type {
  MxmClientConfig,
  MxmClientRequestOptions,
  MxmClientRequestOptionsWithSchema,
  MxmClientResponse,
} from './mxm-client.interfaces.js';
import { successStatusCodeSchema } from './mxm-client.schemas.js';
import { MxmClientUnsafe } from './mxm-client.unsafe.js';
import {
  buildUrl,
  handleRequest,
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
    this.client = new Client(MUSIXMATCH_BASE_URL);

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

  private async executeWithCustomSchema<T>({
    endpoint,
    method,
    query,
    body,
    options,
  }: {
    endpoint: string;
    method: 'GET' | 'POST';
    query: Record<string, unknown>;
    body?: unknown;
    options: MxmClientRequestOptionsWithSchema<T>;
  }): Promise<MxmClientResponse<T>> {
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

    return handleResponseWithSchema<MxmClientResponse<T>>({
      method,
      path,
      statusCode,
      data,
      statusCodeSchema: successStatusCodeSchema,
      responseSchema: options.responseSchema,
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

  async matcherLyricsGet<
    TQuery extends MatcherLyricsGetQuery = MatcherLyricsGetQuery,
    TResponse extends
      MxmClientMatcherLyricsGetResponse = MxmClientMatcherLyricsGetResponse,
  >(input: {
    query: TQuery & { apiKey?: never };
    apiKey?: string;
    options?:
      | MxmClientRequestOptions
      | MxmClientRequestOptionsWithSchema<TResponse>;
  }): Promise<MxmClientResponse<TResponse>> {
    if (input.options && 'responseSchema' in input.options) {
      return this.executeWithCustomSchema({
        endpoint: '/ws/1.1/matcher.lyrics.get',
        method: 'GET',
        query: { ...input.query, apiKey: input.apiKey || this.config?.apiKey },
        options: input.options,
      });
    }

    return matcherLyricsGet({
      input: {
        query: { ...input.query, apiKey: input.apiKey || this.config?.apiKey },
      },
      client: this.client,
      logger: this.logger,
      options: this.resolveOptions(input.options),
    }) as Promise<MxmClientResponse<TResponse>>;
  }

  async matcherSubtitleGet<
    TQuery extends MatcherSubtitleGetQuery = MatcherSubtitleGetQuery,
    TResponse extends
      MxmClientMatcherSubtitleGetResponse = MxmClientMatcherSubtitleGetResponse,
  >(input: {
    query: TQuery & { apiKey?: never };
    apiKey?: string;
    options?:
      | MxmClientRequestOptions
      | MxmClientRequestOptionsWithSchema<TResponse>;
  }): Promise<MxmClientResponse<TResponse>> {
    if (input.options && 'responseSchema' in input.options) {
      return this.executeWithCustomSchema({
        endpoint: '/ws/1.1/matcher.subtitle.get',
        method: 'GET',
        query: { ...input.query, apiKey: input.apiKey || this.config?.apiKey },
        options: input.options,
      });
    }

    return matcherSubtitleGet({
      input: {
        query: { ...input.query, apiKey: input.apiKey || this.config?.apiKey },
      },
      client: this.client,
      logger: this.logger,
      options: this.resolveOptions(input.options),
    }) as Promise<MxmClientResponse<TResponse>>;
  }

  async matcherTrackGet<
    TQuery extends MatcherTrackGetQuery = MatcherTrackGetQuery,
    TResponse extends
      MxmClientMatcherTrackGetResponse = MxmClientMatcherTrackGetResponse,
  >(input: {
    query: TQuery & { apiKey?: never };
    apiKey?: string;
    options?:
      | MxmClientRequestOptions
      | MxmClientRequestOptionsWithSchema<TResponse>;
  }): Promise<MxmClientResponse<TResponse>> {
    if (input.options && 'responseSchema' in input.options) {
      return this.executeWithCustomSchema({
        endpoint: '/ws/1.1/matcher.track.get',
        method: 'GET',
        query: { ...input.query, apiKey: input.apiKey || this.config?.apiKey },
        options: input.options,
      });
    }

    return matcherTrackGet({
      input: {
        query: { ...input.query, apiKey: input.apiKey || this.config?.apiKey },
      },
      client: this.client,
      logger: this.logger,
      options: this.resolveOptions(input.options),
    }) as Promise<MxmClientResponse<TResponse>>;
  }

  async trackGet<
    TQuery extends TrackGetQuery = TrackGetQuery,
    TResponse extends MxmClientTrackGetResponse = MxmClientTrackGetResponse,
  >(input: {
    query: TQuery & { apiKey?: never };
    apiKey?: string;
    options?:
      | MxmClientRequestOptions
      | MxmClientRequestOptionsWithSchema<TResponse>;
  }): Promise<MxmClientResponse<TResponse>> {
    if (input.options && 'responseSchema' in input.options) {
      return this.executeWithCustomSchema({
        endpoint: '/ws/1.1/track.get',
        method: 'GET',
        query: { ...input.query, apiKey: input.apiKey || this.config?.apiKey },
        options: input.options,
      });
    }

    return trackGet({
      input: {
        query: { ...input.query, apiKey: input.apiKey || this.config?.apiKey },
      },
      client: this.client,
      logger: this.logger,
      options: this.resolveOptions(input.options),
    }) as Promise<MxmClientResponse<TResponse>>;
  }

  async trackLyricsGet<
    TQuery extends TrackLyricsGetQuery = TrackLyricsGetQuery,
    TResponse extends
      MxmClientTrackLyricsGetResponse = MxmClientTrackLyricsGetResponse,
  >(input: {
    query: TQuery & { apiKey?: never };
    apiKey?: string;
    options?:
      | MxmClientRequestOptions
      | MxmClientRequestOptionsWithSchema<TResponse>;
  }): Promise<MxmClientResponse<TResponse>> {
    if (input.options && 'responseSchema' in input.options) {
      return this.executeWithCustomSchema({
        endpoint: '/ws/1.1/track.lyrics.get',
        method: 'GET',
        query: { ...input.query, apiKey: input.apiKey || this.config?.apiKey },
        options: input.options,
      });
    }

    return trackLyricsGet({
      input: {
        query: { ...input.query, apiKey: input.apiKey || this.config?.apiKey },
      },
      client: this.client,
      logger: this.logger,
      options: this.resolveOptions(input.options),
    }) as Promise<MxmClientResponse<TResponse>>;
  }

  async trackSubtitleGet<
    TQuery extends TrackSubtitleGetQuery = TrackSubtitleGetQuery,
    TResponse extends
      MxmClientTrackSubtitleGetResponse = MxmClientTrackSubtitleGetResponse,
  >(input: {
    query: TQuery & { apiKey?: never };
    apiKey?: string;
    options?:
      | MxmClientRequestOptions
      | MxmClientRequestOptionsWithSchema<TResponse>;
  }): Promise<MxmClientResponse<TResponse>> {
    if (input.options && 'responseSchema' in input.options) {
      return this.executeWithCustomSchema({
        endpoint: '/ws/1.1/track.subtitle.get',
        method: 'GET',
        query: { ...input.query, apiKey: input.apiKey || this.config?.apiKey },
        options: input.options,
      });
    }

    return trackSubtitleGet({
      input: {
        query: { ...input.query, apiKey: input.apiKey || this.config?.apiKey },
      },
      client: this.client,
      logger: this.logger,
      options: this.resolveOptions(input.options),
    }) as Promise<MxmClientResponse<TResponse>>;
  }

  async trackRichSyncGet<
    TQuery extends TrackRichSyncGetQuery = TrackRichSyncGetQuery,
    TResponse extends
      MxmClientTrackRichSyncGetResponse = MxmClientTrackRichSyncGetResponse,
  >(input: {
    query: TQuery & { apiKey?: never };
    apiKey?: string;
    options?:
      | MxmClientRequestOptions
      | MxmClientRequestOptionsWithSchema<TResponse>;
  }): Promise<MxmClientResponse<TResponse>> {
    if (input.options && 'responseSchema' in input.options) {
      return this.executeWithCustomSchema({
        endpoint: '/ws/1.1/track.richsync.get',
        method: 'GET',
        query: { ...input.query, apiKey: input.apiKey || this.config?.apiKey },
        options: input.options,
      });
    }

    return trackRichSyncGet({
      input: {
        query: { ...input.query, apiKey: input.apiKey || this.config?.apiKey },
      },
      client: this.client,
      logger: this.logger,
      options: this.resolveOptions(input.options),
    }) as Promise<MxmClientResponse<TResponse>>;
  }

  async trackSearch<
    TQuery extends TrackSearchQuery = TrackSearchQuery,
    TResponse extends
      MxmClientTrackSearchResponse = MxmClientTrackSearchResponse,
  >(input: {
    query: TQuery & { apiKey?: never };
    apiKey?: string;
    options?:
      | MxmClientRequestOptions
      | MxmClientRequestOptionsWithSchema<TResponse>;
  }): Promise<MxmClientResponse<TResponse>> {
    if (input.options && 'responseSchema' in input.options) {
      return this.executeWithCustomSchema({
        endpoint: '/ws/1.1/track.search',
        method: 'GET',
        query: { ...input.query, apiKey: input.apiKey || this.config?.apiKey },
        options: input.options,
      });
    }

    return trackSearch({
      input: {
        query: { ...input.query, apiKey: input.apiKey || this.config?.apiKey },
      },
      client: this.client,
      logger: this.logger,
      options: this.resolveOptions(input.options),
    }) as Promise<MxmClientResponse<TResponse>>;
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
    options?:
      | MxmClientRequestOptions
      | MxmClientRequestOptionsWithSchema<TResponse>;
  }): Promise<MxmClientResponse<TResponse>> {
    if (input.options && 'responseSchema' in input.options) {
      return this.executeWithCustomSchema({
        endpoint: '/ws/1.1/track.lyrics.fingerprint.post',
        method: 'POST',
        query: { ...input.query, apiKey: input.apiKey || this.config?.apiKey },
        body: { data: { text: input.body.text } },
        options: input.options,
      });
    }

    return trackLyricsFingerprintPost({
      input: {
        query: {
          ...input.query,
          apiKey: input.apiKey || this.config?.apiKey,
        },
        body: input.body,
      },
      client: this.client,
      logger: this.logger,
      options: this.resolveOptions(input.options),
    }) as Promise<MxmClientResponse<TResponse>>;
  }
}
