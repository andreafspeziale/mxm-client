import type { StandardSchemaV1 } from '@standard-schema/spec';
import { type Logger, pino } from 'pino';
import { Client } from 'undici';
import type { z } from 'zod';
import type {
  AlbumGetQuery,
  MxmClientAlbumGetResponse,
} from './endpoints/album.get/definition.js';
import {
  ALBUM_GET_ENDPOINT,
  mxmClientAlbumGetResponseSchema,
} from './endpoints/album.get/definition.js';
import type {
  AlbumTracksGetQuery,
  MxmClientAlbumTracksGetResponse,
} from './endpoints/album.tracks.get/definition.js';
import {
  ALBUM_TRACKS_GET_ENDPOINT,
  mxmClientAlbumTracksGetResponseSchema,
} from './endpoints/album.tracks.get/definition.js';
import type {
  ArtistAlbumsGetQuery,
  MxmClientArtistAlbumsGetResponse,
} from './endpoints/artist.albums.get/definition.js';
import {
  ARTIST_ALBUMS_GET_ENDPOINT,
  mxmClientArtistAlbumsGetResponseSchema,
} from './endpoints/artist.albums.get/definition.js';
import type {
  ArtistGetQuery,
  MxmClientArtistGetResponse,
} from './endpoints/artist.get/definition.js';
import {
  ARTIST_GET_ENDPOINT,
  mxmClientArtistGetResponseSchema,
} from './endpoints/artist.get/definition.js';
import type {
  ArtistSearchQuery,
  MxmClientArtistSearchResponse,
} from './endpoints/artist.search/definition.js';
import {
  ARTIST_SEARCH_ENDPOINT,
  mxmClientArtistSearchResponseSchema,
} from './endpoints/artist.search/definition.js';
import type {
  ChartArtistsGetQuery,
  MxmClientChartArtistsGetResponse,
} from './endpoints/chart.artists.get/definition.js';
import {
  CHART_ARTISTS_GET_ENDPOINT,
  mxmClientChartArtistsGetResponseSchema,
} from './endpoints/chart.artists.get/definition.js';
import type {
  ChartTracksGetQuery,
  MxmClientChartTracksGetResponse,
} from './endpoints/chart.tracks.get/definition.js';
import {
  CHART_TRACKS_GET_ENDPOINT,
  mxmClientChartTracksGetResponseSchema,
} from './endpoints/chart.tracks.get/definition.js';
import type {
  LanguagesGetQuery,
  MxmClientLanguagesGetResponse,
} from './endpoints/languages.get/definition.js';
import {
  LANGUAGES_GET_ENDPOINT,
  mxmClientLanguagesGetResponseSchema,
} from './endpoints/languages.get/definition.js';
import type {
  MatcherLyricsGetQuery,
  MxmClientMatcherLyricsGetResponse,
} from './endpoints/matcher.lyrics.get/definition.js';
import {
  MATCHER_LYRICS_GET_ENDPOINT,
  mxmClientMatcherLyricsGetResponseSchema,
} from './endpoints/matcher.lyrics.get/definition.js';
import type {
  MatcherSubtitleGetQuery,
  MxmClientMatcherSubtitleGetResponse,
} from './endpoints/matcher.subtitle.get/definition.js';
import {
  MATCHER_SUBTITLE_GET_ENDPOINT,
  mxmClientMatcherSubtitleGetResponseSchema,
} from './endpoints/matcher.subtitle.get/definition.js';
import type {
  MatcherTrackGetQuery,
  MxmClientMatcherTrackGetResponse,
} from './endpoints/matcher.track.get/definition.js';
import {
  MATCHER_TRACK_GET_ENDPOINT,
  mxmClientMatcherTrackGetResponseSchema,
} from './endpoints/matcher.track.get/definition.js';
import type {
  MusicGenresGetQuery,
  MxmClientMusicGenresGetResponse,
} from './endpoints/music.genres.get/definition.js';
import {
  MUSIC_GENRES_GET_ENDPOINT,
  mxmClientMusicGenresGetResponseSchema,
} from './endpoints/music.genres.get/definition.js';
import type {
  MxmClientTrackGetResponse,
  TrackGetQuery,
} from './endpoints/track.get/definition.js';
import {
  mxmClientTrackGetResponseSchema,
  TRACK_GET_ENDPOINT,
} from './endpoints/track.get/definition.js';
import type {
  MxmClientTrackLyricsFingerprintPostResponse,
  TrackLyricsFingerprintPostBody,
  TrackLyricsFingerprintPostQuery,
} from './endpoints/track.lyrics.fingerprint.post/definition.js';
import {
  mxmClientTrackLyricsFingerprintPostResponseSchema,
  TRACK_LYRICS_FINGERPRINT_POST_ENDPOINT,
} from './endpoints/track.lyrics.fingerprint.post/definition.js';
import type {
  MxmClientTrackLyricsGetResponse,
  TrackLyricsGetQuery,
} from './endpoints/track.lyrics.get/definition.js';
import {
  mxmClientTrackLyricsGetResponseSchema,
  TRACK_LYRICS_GET_ENDPOINT,
} from './endpoints/track.lyrics.get/definition.js';
import type {
  MxmClientTrackLyricsTranslationGetResponse,
  TrackLyricsTranslationGetQuery,
} from './endpoints/track.lyrics.translation.get/definition.js';
import {
  mxmClientTrackLyricsTranslationGetResponseSchema,
  TRACK_LYRICS_TRANSLATION_GET_ENDPOINT,
} from './endpoints/track.lyrics.translation.get/definition.js';
import type {
  MxmClientTrackRichSyncGetResponse,
  TrackRichSyncGetQuery,
} from './endpoints/track.richsync.get/definition.js';
import {
  mxmClientTrackRichSyncGetResponseSchema,
  TRACK_RICHSYNC_GET_ENDPOINT,
} from './endpoints/track.richsync.get/definition.js';
import type {
  MxmClientTrackSearchResponse,
  TrackSearchQuery,
} from './endpoints/track.search/definition.js';
import {
  mxmClientTrackSearchResponseSchema,
  TRACK_SEARCH_ENDPOINT,
} from './endpoints/track.search/definition.js';
import type {
  MxmClientTrackSnippetGetResponse,
  TrackSnippetGetQuery,
} from './endpoints/track.snippet.get/definition.js';
import {
  mxmClientTrackSnippetGetResponseSchema,
  TRACK_SNIPPET_GET_ENDPOINT,
} from './endpoints/track.snippet.get/definition.js';
import type {
  MxmClientTrackSubtitleGetResponse,
  TrackSubtitleGetQuery,
} from './endpoints/track.subtitle.get/definition.js';
import {
  mxmClientTrackSubtitleGetResponseSchema,
  TRACK_SUBTITLE_GET_ENDPOINT,
} from './endpoints/track.subtitle.get/definition.js';
import type {
  MxmClientTrackSubtitleTranslationGetResponse,
  TrackSubtitleTranslationGetQuery,
} from './endpoints/track.subtitle.translation.get/definition.js';
import {
  mxmClientTrackSubtitleTranslationGetResponseSchema,
  TRACK_SUBTITLE_TRANSLATION_GET_ENDPOINT,
} from './endpoints/track.subtitle.translation.get/definition.js';
import { MUSIXMATCH_BASE_URL } from './mxm-client.constants.js';
import { MxmClientError } from './mxm-client.error.js';
import type { SafeGetMethod, SafePostMethod } from './mxm-client.factory.js';
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

  private createGet(endpoint: string, responseSchema: z.ZodSchema) {
    return (input: {
      query: object;
      options?: MxmClientRequestOptions | MxmClientRequestOptionsWithSchema;
    }): Promise<MxmClientResponse<never>> => {
      return this.execute({
        endpoint,
        method: 'GET',
        query: input.query,
        dataSchema: buildLegacyAPIResponseSchema(responseSchema),
        options: input.options,
      });
    };
  }

  private createPost<TBody>(
    endpoint: string,
    responseSchema: z.ZodSchema,
    transformBody: (body: TBody) => unknown,
  ) {
    return (input: {
      query?: object;
      body: TBody;
      options?: MxmClientRequestOptions | MxmClientRequestOptionsWithSchema;
    }): Promise<MxmClientResponse<never>> => {
      return this.execute({
        endpoint,
        method: 'POST',
        query: input.query ?? {},
        body: transformBody(input.body),
        dataSchema: buildLegacyAPIResponseSchema(responseSchema),
        options: input.options,
      });
    };
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

  // --- GET endpoints ---

  readonly albumGet: SafeGetMethod<AlbumGetQuery, MxmClientAlbumGetResponse> =
    this.createGet(ALBUM_GET_ENDPOINT, mxmClientAlbumGetResponseSchema);

  readonly albumTracksGet: SafeGetMethod<
    AlbumTracksGetQuery,
    MxmClientAlbumTracksGetResponse
  > = this.createGet(
    ALBUM_TRACKS_GET_ENDPOINT,
    mxmClientAlbumTracksGetResponseSchema,
  );

  readonly artistGet: SafeGetMethod<
    ArtistGetQuery,
    MxmClientArtistGetResponse
  > = this.createGet(ARTIST_GET_ENDPOINT, mxmClientArtistGetResponseSchema);

  readonly artistSearch: SafeGetMethod<
    ArtistSearchQuery,
    MxmClientArtistSearchResponse
  > = this.createGet(
    ARTIST_SEARCH_ENDPOINT,
    mxmClientArtistSearchResponseSchema,
  );

  readonly artistAlbumsGet: SafeGetMethod<
    ArtistAlbumsGetQuery,
    MxmClientArtistAlbumsGetResponse
  > = this.createGet(
    ARTIST_ALBUMS_GET_ENDPOINT,
    mxmClientArtistAlbumsGetResponseSchema,
  );

  readonly chartTracksGet: SafeGetMethod<
    ChartTracksGetQuery,
    MxmClientChartTracksGetResponse
  > = this.createGet(
    CHART_TRACKS_GET_ENDPOINT,
    mxmClientChartTracksGetResponseSchema,
  );

  readonly chartArtistsGet: SafeGetMethod<
    ChartArtistsGetQuery,
    MxmClientChartArtistsGetResponse
  > = this.createGet(
    CHART_ARTISTS_GET_ENDPOINT,
    mxmClientChartArtistsGetResponseSchema,
  );

  readonly languagesGet: SafeGetMethod<
    LanguagesGetQuery,
    MxmClientLanguagesGetResponse
  > = this.createGet(
    LANGUAGES_GET_ENDPOINT,
    mxmClientLanguagesGetResponseSchema,
  );

  readonly matcherLyricsGet: SafeGetMethod<
    MatcherLyricsGetQuery,
    MxmClientMatcherLyricsGetResponse
  > = this.createGet(
    MATCHER_LYRICS_GET_ENDPOINT,
    mxmClientMatcherLyricsGetResponseSchema,
  );

  readonly matcherSubtitleGet: SafeGetMethod<
    MatcherSubtitleGetQuery,
    MxmClientMatcherSubtitleGetResponse
  > = this.createGet(
    MATCHER_SUBTITLE_GET_ENDPOINT,
    mxmClientMatcherSubtitleGetResponseSchema,
  );

  readonly matcherTrackGet: SafeGetMethod<
    MatcherTrackGetQuery,
    MxmClientMatcherTrackGetResponse
  > = this.createGet(
    MATCHER_TRACK_GET_ENDPOINT,
    mxmClientMatcherTrackGetResponseSchema,
  );

  readonly musicGenresGet: SafeGetMethod<
    MusicGenresGetQuery,
    MxmClientMusicGenresGetResponse
  > = this.createGet(
    MUSIC_GENRES_GET_ENDPOINT,
    mxmClientMusicGenresGetResponseSchema,
  );

  readonly trackGet: SafeGetMethod<TrackGetQuery, MxmClientTrackGetResponse> =
    this.createGet(TRACK_GET_ENDPOINT, mxmClientTrackGetResponseSchema);

  readonly trackLyricsGet: SafeGetMethod<
    TrackLyricsGetQuery,
    MxmClientTrackLyricsGetResponse
  > = this.createGet(
    TRACK_LYRICS_GET_ENDPOINT,
    mxmClientTrackLyricsGetResponseSchema,
  );

  readonly trackLyricsTranslationGet: SafeGetMethod<
    TrackLyricsTranslationGetQuery,
    MxmClientTrackLyricsTranslationGetResponse
  > = this.createGet(
    TRACK_LYRICS_TRANSLATION_GET_ENDPOINT,
    mxmClientTrackLyricsTranslationGetResponseSchema,
  );

  readonly trackSubtitleGet: SafeGetMethod<
    TrackSubtitleGetQuery,
    MxmClientTrackSubtitleGetResponse
  > = this.createGet(
    TRACK_SUBTITLE_GET_ENDPOINT,
    mxmClientTrackSubtitleGetResponseSchema,
  );

  readonly trackSubtitleTranslationGet: SafeGetMethod<
    TrackSubtitleTranslationGetQuery,
    MxmClientTrackSubtitleTranslationGetResponse
  > = this.createGet(
    TRACK_SUBTITLE_TRANSLATION_GET_ENDPOINT,
    mxmClientTrackSubtitleTranslationGetResponseSchema,
  );

  readonly trackRichSyncGet: SafeGetMethod<
    TrackRichSyncGetQuery,
    MxmClientTrackRichSyncGetResponse
  > = this.createGet(
    TRACK_RICHSYNC_GET_ENDPOINT,
    mxmClientTrackRichSyncGetResponseSchema,
  );

  readonly trackSearch: SafeGetMethod<
    TrackSearchQuery,
    MxmClientTrackSearchResponse
  > = this.createGet(TRACK_SEARCH_ENDPOINT, mxmClientTrackSearchResponseSchema);

  readonly trackSnippetGet: SafeGetMethod<
    TrackSnippetGetQuery,
    MxmClientTrackSnippetGetResponse
  > = this.createGet(
    TRACK_SNIPPET_GET_ENDPOINT,
    mxmClientTrackSnippetGetResponseSchema,
  );

  // --- POST endpoints ---

  readonly trackLyricsFingerprintPost: SafePostMethod<
    TrackLyricsFingerprintPostQuery,
    TrackLyricsFingerprintPostBody,
    MxmClientTrackLyricsFingerprintPostResponse
  > = this.createPost(
    TRACK_LYRICS_FINGERPRINT_POST_ENDPOINT,
    mxmClientTrackLyricsFingerprintPostResponseSchema,
    (body) => ({
      data: { text: body.text },
    }),
  );
}
