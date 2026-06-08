import type { Logger } from 'pino';
import type { Client } from 'undici';
import type {
  AlbumGetQuery,
  MxmClientAlbumGetResponse,
} from './endpoints/album.get/definition.js';
import {
  ALBUM_GET_ENDPOINT,
  ALBUM_GET_METHOD,
} from './endpoints/album.get/definition.js';
import type {
  ArtistAlbumsGetQuery,
  MxmClientArtistAlbumsGetResponse,
} from './endpoints/artist.albums.get/definition.js';
import {
  ARTIST_ALBUMS_GET_ENDPOINT,
  ARTIST_ALBUMS_GET_METHOD,
} from './endpoints/artist.albums.get/definition.js';
import type {
  ArtistGetQuery,
  MxmClientArtistGetResponse,
} from './endpoints/artist.get/definition.js';
import {
  ARTIST_GET_ENDPOINT,
  ARTIST_GET_METHOD,
} from './endpoints/artist.get/definition.js';
import type {
  ArtistSearchQuery,
  MxmClientArtistSearchResponse,
} from './endpoints/artist.search/definition.js';
import {
  ARTIST_SEARCH_ENDPOINT,
  ARTIST_SEARCH_METHOD,
} from './endpoints/artist.search/definition.js';
import type {
  LanguagesGetQuery,
  MxmClientLanguagesGetResponse,
} from './endpoints/languages.get/definition.js';
import {
  LANGUAGES_GET_ENDPOINT,
  LANGUAGES_GET_METHOD,
} from './endpoints/languages.get/definition.js';
import type {
  MatcherLyricsGetQuery,
  MxmClientMatcherLyricsGetResponse,
} from './endpoints/matcher.lyrics.get/definition.js';
import {
  MATCHER_LYRICS_GET_ENDPOINT,
  MATCHER_LYRICS_GET_METHOD,
} from './endpoints/matcher.lyrics.get/definition.js';
import type {
  MatcherSubtitleGetQuery,
  MxmClientMatcherSubtitleGetResponse,
} from './endpoints/matcher.subtitle.get/definition.js';
import {
  MATCHER_SUBTITLE_GET_ENDPOINT,
  MATCHER_SUBTITLE_GET_METHOD,
} from './endpoints/matcher.subtitle.get/definition.js';
import type {
  MatcherTrackGetQuery,
  MxmClientMatcherTrackGetResponse,
} from './endpoints/matcher.track.get/definition.js';
import {
  MATCHER_TRACK_GET_ENDPOINT,
  MATCHER_TRACK_GET_METHOD,
} from './endpoints/matcher.track.get/definition.js';
import type {
  MxmClientTrackGetResponse,
  TrackGetQuery,
} from './endpoints/track.get/definition.js';
import {
  TRACK_GET_ENDPOINT,
  TRACK_GET_METHOD,
} from './endpoints/track.get/definition.js';
import type {
  MxmClientTrackLyricsFingerprintPostResponse,
  TrackLyricsFingerprintPostBody,
  TrackLyricsFingerprintPostQuery,
} from './endpoints/track.lyrics.fingerprint.post/definition.js';
import {
  TRACK_LYRICS_FINGERPRINT_POST_ENDPOINT,
  TRACK_LYRICS_FINGERPRINT_POST_METHOD,
} from './endpoints/track.lyrics.fingerprint.post/definition.js';
import type {
  MxmClientTrackLyricsGetResponse,
  TrackLyricsGetQuery,
} from './endpoints/track.lyrics.get/definition.js';
import {
  TRACK_LYRICS_GET_ENDPOINT,
  TRACK_LYRICS_GET_METHOD,
} from './endpoints/track.lyrics.get/definition.js';
import type {
  MxmClientTrackLyricsTranslationGetResponse,
  TrackLyricsTranslationGetQuery,
} from './endpoints/track.lyrics.translation.get/definition.js';
import {
  TRACK_LYRICS_TRANSLATION_GET_ENDPOINT,
  TRACK_LYRICS_TRANSLATION_GET_METHOD,
} from './endpoints/track.lyrics.translation.get/definition.js';
import type {
  MxmClientTrackRichSyncGetResponse,
  TrackRichSyncGetQuery,
} from './endpoints/track.richsync.get/definition.js';
import {
  TRACK_RICHSYNC_GET_ENDPOINT,
  TRACK_RICHSYNC_GET_METHOD,
} from './endpoints/track.richsync.get/definition.js';
import type {
  MxmClientTrackSearchResponse,
  TrackSearchQuery,
} from './endpoints/track.search/definition.js';
import {
  TRACK_SEARCH_ENDPOINT,
  TRACK_SEARCH_METHOD,
} from './endpoints/track.search/definition.js';
import type {
  MxmClientTrackSnippetGetResponse,
  TrackSnippetGetQuery,
} from './endpoints/track.snippet.get/definition.js';
import {
  TRACK_SNIPPET_GET_ENDPOINT,
  TRACK_SNIPPET_GET_METHOD,
} from './endpoints/track.snippet.get/definition.js';
import type {
  MxmClientTrackSubtitleGetResponse,
  TrackSubtitleGetQuery,
} from './endpoints/track.subtitle.get/definition.js';
import {
  TRACK_SUBTITLE_GET_ENDPOINT,
  TRACK_SUBTITLE_GET_METHOD,
} from './endpoints/track.subtitle.get/definition.js';
import type {
  MxmClientTrackSubtitleTranslationGetResponse,
  TrackSubtitleTranslationGetQuery,
} from './endpoints/track.subtitle.translation.get/definition.js';
import {
  TRACK_SUBTITLE_TRANSLATION_GET_ENDPOINT,
  TRACK_SUBTITLE_TRANSLATION_GET_METHOD,
} from './endpoints/track.subtitle.translation.get/definition.js';
import { MxmClientError } from './mxm-client.error.js';
import type {
  AllowedHTTPMethods,
  MxmClientOptionalAPIKey,
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
    query: object;
    body?: unknown;
    options?: MxmClientRequestOptions | undefined;
  }): Promise<MxmClientResponse<TResponse>> {
    const queryRecord = query as Record<string, unknown>;
    const resolvedQuery = {
      ...queryRecord,
      apiKey: (queryRecord['apiKey'] as string | undefined) ?? this.apiKey,
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

  async albumGet<
    TQuery extends AlbumGetQuery = AlbumGetQuery,
    TResponse extends MxmClientAlbumGetResponse = MxmClientAlbumGetResponse,
  >(input: {
    query: TQuery & MxmClientOptionalAPIKey;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<TResponse>> {
    return this.execute<TResponse>({
      endpoint: ALBUM_GET_ENDPOINT,
      method: ALBUM_GET_METHOD,
      query: input.query,
      options: input.options,
    });
  }

  async artistGet<
    TQuery extends ArtistGetQuery = ArtistGetQuery,
    TResponse extends MxmClientArtistGetResponse = MxmClientArtistGetResponse,
  >(input: {
    query: TQuery & MxmClientOptionalAPIKey;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<TResponse>> {
    return this.execute<TResponse>({
      endpoint: ARTIST_GET_ENDPOINT,
      method: ARTIST_GET_METHOD,
      query: input.query,
      options: input.options,
    });
  }

  async artistSearch<
    TQuery extends ArtistSearchQuery = ArtistSearchQuery,
    TResponse extends
      MxmClientArtistSearchResponse = MxmClientArtistSearchResponse,
  >(input: {
    query: TQuery & MxmClientOptionalAPIKey;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<TResponse>> {
    return this.execute<TResponse>({
      endpoint: ARTIST_SEARCH_ENDPOINT,
      method: ARTIST_SEARCH_METHOD,
      query: input.query,
      options: input.options,
    });
  }

  async artistAlbumsGet<
    TQuery extends ArtistAlbumsGetQuery = ArtistAlbumsGetQuery,
    TResponse extends
      MxmClientArtistAlbumsGetResponse = MxmClientArtistAlbumsGetResponse,
  >(input: {
    query: TQuery & MxmClientOptionalAPIKey;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<TResponse>> {
    return this.execute<TResponse>({
      endpoint: ARTIST_ALBUMS_GET_ENDPOINT,
      method: ARTIST_ALBUMS_GET_METHOD,
      query: input.query,
      options: input.options,
    });
  }

  async languagesGet<
    TQuery extends LanguagesGetQuery = LanguagesGetQuery,
    TResponse extends
      MxmClientLanguagesGetResponse = MxmClientLanguagesGetResponse,
  >(input: {
    query: TQuery & MxmClientOptionalAPIKey;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<TResponse>> {
    return this.execute<TResponse>({
      endpoint: LANGUAGES_GET_ENDPOINT,
      method: LANGUAGES_GET_METHOD,
      query: input.query,
      options: input.options,
    });
  }

  async matcherLyricsGet<
    TQuery extends MatcherLyricsGetQuery = MatcherLyricsGetQuery,
    TResponse extends
      MxmClientMatcherLyricsGetResponse = MxmClientMatcherLyricsGetResponse,
  >(input: {
    query: TQuery & MxmClientOptionalAPIKey;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<TResponse>> {
    return this.execute<TResponse>({
      endpoint: MATCHER_LYRICS_GET_ENDPOINT,
      method: MATCHER_LYRICS_GET_METHOD,
      query: input.query,
      options: input.options,
    });
  }

  async matcherSubtitleGet<
    TQuery extends MatcherSubtitleGetQuery = MatcherSubtitleGetQuery,
    TResponse extends
      MxmClientMatcherSubtitleGetResponse = MxmClientMatcherSubtitleGetResponse,
  >(input: {
    query: TQuery & MxmClientOptionalAPIKey;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<TResponse>> {
    return this.execute<TResponse>({
      endpoint: MATCHER_SUBTITLE_GET_ENDPOINT,
      method: MATCHER_SUBTITLE_GET_METHOD,
      query: input.query,
      options: input.options,
    });
  }

  async matcherTrackGet<
    TQuery extends MatcherTrackGetQuery = MatcherTrackGetQuery,
    TResponse extends
      MxmClientMatcherTrackGetResponse = MxmClientMatcherTrackGetResponse,
  >(input: {
    query: TQuery & MxmClientOptionalAPIKey;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<TResponse>> {
    return this.execute<TResponse>({
      endpoint: MATCHER_TRACK_GET_ENDPOINT,
      method: MATCHER_TRACK_GET_METHOD,
      query: input.query,
      options: input.options,
    });
  }

  async trackGet<
    TQuery extends TrackGetQuery = TrackGetQuery,
    TResponse extends MxmClientTrackGetResponse = MxmClientTrackGetResponse,
  >(input: {
    query: TQuery & MxmClientOptionalAPIKey;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<TResponse>> {
    return this.execute<TResponse>({
      endpoint: TRACK_GET_ENDPOINT,
      method: TRACK_GET_METHOD,
      query: input.query,
      options: input.options,
    });
  }

  async trackLyricsGet<
    TQuery extends TrackLyricsGetQuery = TrackLyricsGetQuery,
    TResponse extends
      MxmClientTrackLyricsGetResponse = MxmClientTrackLyricsGetResponse,
  >(input: {
    query: TQuery & MxmClientOptionalAPIKey;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<TResponse>> {
    return this.execute<TResponse>({
      endpoint: TRACK_LYRICS_GET_ENDPOINT,
      method: TRACK_LYRICS_GET_METHOD,
      query: input.query,
      options: input.options,
    });
  }

  async trackLyricsTranslationGet<
    TQuery extends
      TrackLyricsTranslationGetQuery = TrackLyricsTranslationGetQuery,
    TResponse extends
      MxmClientTrackLyricsTranslationGetResponse = MxmClientTrackLyricsTranslationGetResponse,
  >(input: {
    query: TQuery & MxmClientOptionalAPIKey;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<TResponse>> {
    return this.execute<TResponse>({
      endpoint: TRACK_LYRICS_TRANSLATION_GET_ENDPOINT,
      method: TRACK_LYRICS_TRANSLATION_GET_METHOD,
      query: input.query,
      options: input.options,
    });
  }

  async trackSubtitleGet<
    TQuery extends TrackSubtitleGetQuery = TrackSubtitleGetQuery,
    TResponse extends
      MxmClientTrackSubtitleGetResponse = MxmClientTrackSubtitleGetResponse,
  >(input: {
    query: TQuery & MxmClientOptionalAPIKey;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<TResponse>> {
    return this.execute<TResponse>({
      endpoint: TRACK_SUBTITLE_GET_ENDPOINT,
      method: TRACK_SUBTITLE_GET_METHOD,
      query: input.query,
      options: input.options,
    });
  }

  async trackSubtitleTranslationGet<
    TQuery extends
      TrackSubtitleTranslationGetQuery = TrackSubtitleTranslationGetQuery,
    TResponse extends
      MxmClientTrackSubtitleTranslationGetResponse = MxmClientTrackSubtitleTranslationGetResponse,
  >(input: {
    query: TQuery & MxmClientOptionalAPIKey;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<TResponse>> {
    return this.execute<TResponse>({
      endpoint: TRACK_SUBTITLE_TRANSLATION_GET_ENDPOINT,
      method: TRACK_SUBTITLE_TRANSLATION_GET_METHOD,
      query: input.query,
      options: input.options,
    });
  }

  async trackRichSyncGet<
    TQuery extends TrackRichSyncGetQuery = TrackRichSyncGetQuery,
    TResponse extends
      MxmClientTrackRichSyncGetResponse = MxmClientTrackRichSyncGetResponse,
  >(input: {
    query: TQuery & MxmClientOptionalAPIKey;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<TResponse>> {
    return this.execute<TResponse>({
      endpoint: TRACK_RICHSYNC_GET_ENDPOINT,
      method: TRACK_RICHSYNC_GET_METHOD,
      query: input.query,
      options: input.options,
    });
  }

  async trackSearch<
    TQuery extends TrackSearchQuery = TrackSearchQuery,
    TResponse extends
      MxmClientTrackSearchResponse = MxmClientTrackSearchResponse,
  >(input: {
    query: TQuery & MxmClientOptionalAPIKey;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<TResponse>> {
    return this.execute<TResponse>({
      endpoint: TRACK_SEARCH_ENDPOINT,
      method: TRACK_SEARCH_METHOD,
      query: input.query,
      options: input.options,
    });
  }

  async trackSnippetGet<
    TQuery extends TrackSnippetGetQuery = TrackSnippetGetQuery,
    TResponse extends
      MxmClientTrackSnippetGetResponse = MxmClientTrackSnippetGetResponse,
  >(input: {
    query: TQuery & MxmClientOptionalAPIKey;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<TResponse>> {
    return this.execute<TResponse>({
      endpoint: TRACK_SNIPPET_GET_ENDPOINT,
      method: TRACK_SNIPPET_GET_METHOD,
      query: input.query,
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
    query?: TQuery & MxmClientOptionalAPIKey;
    body: TBody;
    options?: MxmClientRequestOptions;
  }): Promise<MxmClientResponse<TResponse>> {
    return this.execute<TResponse>({
      endpoint: TRACK_LYRICS_FINGERPRINT_POST_ENDPOINT,
      method: TRACK_LYRICS_FINGERPRINT_POST_METHOD,
      query: input.query ?? {},
      body: { data: { text: input.body.text } },
      options: input.options,
    });
  }
}
