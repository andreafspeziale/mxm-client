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
import type {
  MxmClientConfig,
  MxmClientResponse,
} from './mxm-client.interfaces.js';

export class MxmClient {
  private readonly client: Client;
  private readonly config?: MxmClientConfig;
  private readonly logger?: Logger;

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

  async matcherLyricsGet<
    TQuery extends MatcherLyricsGetQuery = MatcherLyricsGetQuery,
  >(input: {
    query: TQuery & { apiKey?: never };
    apiKey?: string;
  }): Promise<MxmClientResponse<MxmClientMatcherLyricsGetResponse>> {
    return matcherLyricsGet({
      input: {
        query: { ...input.query, apiKey: input.apiKey || this.config?.apiKey },
      },
      client: this.client,
      logger: this.logger,
    });
  }

  async matcherSubtitleGet<
    TQuery extends MatcherSubtitleGetQuery = MatcherSubtitleGetQuery,
  >(input: {
    query: TQuery & { apiKey?: never };
    apiKey?: string;
  }): Promise<MxmClientResponse<MxmClientMatcherSubtitleGetResponse>> {
    return matcherSubtitleGet({
      input: {
        query: { ...input.query, apiKey: input.apiKey || this.config?.apiKey },
      },
      client: this.client,
      logger: this.logger,
    });
  }

  async matcherTrackGet<
    TQuery extends MatcherTrackGetQuery = MatcherTrackGetQuery,
  >(input: {
    query: TQuery & { apiKey?: never };
    apiKey?: string;
  }): Promise<MxmClientResponse<MxmClientMatcherTrackGetResponse>> {
    return matcherTrackGet({
      input: {
        query: { ...input.query, apiKey: input.apiKey || this.config?.apiKey },
      },
      client: this.client,
      logger: this.logger,
    });
  }

  async trackGet<TQuery extends TrackGetQuery = TrackGetQuery>(input: {
    query: TQuery & { apiKey?: never };
    apiKey?: string;
  }): Promise<MxmClientResponse<MxmClientTrackGetResponse>> {
    return trackGet({
      input: {
        query: { ...input.query, apiKey: input.apiKey || this.config?.apiKey },
      },
      client: this.client,
      logger: this.logger,
    });
  }

  async trackLyricsGet<
    TQuery extends TrackLyricsGetQuery = TrackLyricsGetQuery,
  >(input: {
    query: TQuery & { apiKey?: never };
    apiKey?: string;
  }): Promise<MxmClientResponse<MxmClientTrackLyricsGetResponse>> {
    return trackLyricsGet({
      input: {
        query: { ...input.query, apiKey: input.apiKey || this.config?.apiKey },
      },
      client: this.client,
      logger: this.logger,
    });
  }

  async trackSubtitleGet<
    TQuery extends TrackSubtitleGetQuery = TrackSubtitleGetQuery,
  >(input: {
    query: TQuery & { apiKey?: never };
    apiKey?: string;
  }): Promise<MxmClientResponse<MxmClientTrackSubtitleGetResponse>> {
    return trackSubtitleGet({
      input: {
        query: { ...input.query, apiKey: input.apiKey || this.config?.apiKey },
      },
      client: this.client,
      logger: this.logger,
    });
  }

  async trackRichSyncGet<
    TQuery extends TrackRichSyncGetQuery = TrackRichSyncGetQuery,
  >(input: {
    query: TQuery & { apiKey?: never };
    apiKey?: string;
  }): Promise<MxmClientResponse<MxmClientTrackRichSyncGetResponse>> {
    return trackRichSyncGet({
      input: {
        query: { ...input.query, apiKey: input.apiKey || this.config?.apiKey },
      },
      client: this.client,
      logger: this.logger,
    });
  }

  async trackSearch<TQuery extends TrackSearchQuery = TrackSearchQuery>(input: {
    query: TQuery & { apiKey?: never };
    apiKey?: string;
  }): Promise<MxmClientResponse<MxmClientTrackSearchResponse>> {
    return trackSearch({
      input: {
        query: { ...input.query, apiKey: input.apiKey || this.config?.apiKey },
      },
      client: this.client,
      logger: this.logger,
    });
  }

  async trackLyricsFingerprintPost<
    TQuery extends
      TrackLyricsFingerprintPostQuery = TrackLyricsFingerprintPostQuery,
    TBody extends
      TrackLyricsFingerprintPostBody = TrackLyricsFingerprintPostBody,
  >(input: {
    query?: TQuery & { apiKey?: never };
    body: TBody;
    apiKey?: string;
  }): Promise<MxmClientResponse<MxmClientTrackLyricsFingerprintPostResponse>> {
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
    });
  }
}
