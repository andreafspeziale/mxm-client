import type { Logger } from 'pino';
import type { Client } from 'undici';
import type {
  AlbumGetQuery,
  MxmClientAlbumGetResponse,
} from './endpoints/album.get/definition.js';
import { ALBUM_GET_ENDPOINT } from './endpoints/album.get/definition.js';
import type {
  AlbumTracksGetQuery,
  MxmClientAlbumTracksGetResponse,
} from './endpoints/album.tracks.get/definition.js';
import { ALBUM_TRACKS_GET_ENDPOINT } from './endpoints/album.tracks.get/definition.js';
import type {
  ArtistAlbumsGetQuery,
  MxmClientArtistAlbumsGetResponse,
} from './endpoints/artist.albums.get/definition.js';
import { ARTIST_ALBUMS_GET_ENDPOINT } from './endpoints/artist.albums.get/definition.js';
import type {
  ArtistGetQuery,
  MxmClientArtistGetResponse,
} from './endpoints/artist.get/definition.js';
import { ARTIST_GET_ENDPOINT } from './endpoints/artist.get/definition.js';
import type {
  ArtistSearchQuery,
  MxmClientArtistSearchResponse,
} from './endpoints/artist.search/definition.js';
import { ARTIST_SEARCH_ENDPOINT } from './endpoints/artist.search/definition.js';
import type {
  ChartArtistsGetQuery,
  MxmClientChartArtistsGetResponse,
} from './endpoints/chart.artists.get/definition.js';
import { CHART_ARTISTS_GET_ENDPOINT } from './endpoints/chart.artists.get/definition.js';
import type {
  ChartTracksGetQuery,
  MxmClientChartTracksGetResponse,
} from './endpoints/chart.tracks.get/definition.js';
import { CHART_TRACKS_GET_ENDPOINT } from './endpoints/chart.tracks.get/definition.js';
import type {
  LanguagesGetQuery,
  MxmClientLanguagesGetResponse,
} from './endpoints/languages.get/definition.js';
import { LANGUAGES_GET_ENDPOINT } from './endpoints/languages.get/definition.js';
import type {
  MatcherLyricsGetQuery,
  MxmClientMatcherLyricsGetResponse,
} from './endpoints/matcher.lyrics.get/definition.js';
import { MATCHER_LYRICS_GET_ENDPOINT } from './endpoints/matcher.lyrics.get/definition.js';
import type {
  MatcherSubtitleGetQuery,
  MxmClientMatcherSubtitleGetResponse,
} from './endpoints/matcher.subtitle.get/definition.js';
import { MATCHER_SUBTITLE_GET_ENDPOINT } from './endpoints/matcher.subtitle.get/definition.js';
import type {
  MatcherTrackGetQuery,
  MxmClientMatcherTrackGetResponse,
} from './endpoints/matcher.track.get/definition.js';
import { MATCHER_TRACK_GET_ENDPOINT } from './endpoints/matcher.track.get/definition.js';
import type {
  MusicGenresGetQuery,
  MxmClientMusicGenresGetResponse,
} from './endpoints/music.genres.get/definition.js';
import { MUSIC_GENRES_GET_ENDPOINT } from './endpoints/music.genres.get/definition.js';
import type {
  MxmClientTrackGetResponse,
  TrackGetQuery,
} from './endpoints/track.get/definition.js';
import { TRACK_GET_ENDPOINT } from './endpoints/track.get/definition.js';
import type {
  MxmClientTrackLyricsFingerprintPostResponse,
  TrackLyricsFingerprintPostBody,
  TrackLyricsFingerprintPostQuery,
} from './endpoints/track.lyrics.fingerprint.post/definition.js';
import { TRACK_LYRICS_FINGERPRINT_POST_ENDPOINT } from './endpoints/track.lyrics.fingerprint.post/definition.js';
import type {
  MxmClientTrackLyricsGetResponse,
  TrackLyricsGetQuery,
} from './endpoints/track.lyrics.get/definition.js';
import { TRACK_LYRICS_GET_ENDPOINT } from './endpoints/track.lyrics.get/definition.js';
import type {
  MxmClientTrackLyricsTranslationGetResponse,
  TrackLyricsTranslationGetQuery,
} from './endpoints/track.lyrics.translation.get/definition.js';
import { TRACK_LYRICS_TRANSLATION_GET_ENDPOINT } from './endpoints/track.lyrics.translation.get/definition.js';
import type {
  MxmClientTrackRichSyncGetResponse,
  TrackRichSyncGetQuery,
} from './endpoints/track.richsync.get/definition.js';
import { TRACK_RICHSYNC_GET_ENDPOINT } from './endpoints/track.richsync.get/definition.js';
import type {
  MxmClientTrackSearchResponse,
  TrackSearchQuery,
} from './endpoints/track.search/definition.js';
import { TRACK_SEARCH_ENDPOINT } from './endpoints/track.search/definition.js';
import type {
  MxmClientTrackSnippetGetResponse,
  TrackSnippetGetQuery,
} from './endpoints/track.snippet.get/definition.js';
import { TRACK_SNIPPET_GET_ENDPOINT } from './endpoints/track.snippet.get/definition.js';
import type {
  MxmClientTrackSubtitleGetResponse,
  TrackSubtitleGetQuery,
} from './endpoints/track.subtitle.get/definition.js';
import { TRACK_SUBTITLE_GET_ENDPOINT } from './endpoints/track.subtitle.get/definition.js';
import type {
  MxmClientTrackSubtitleTranslationGetResponse,
  TrackSubtitleTranslationGetQuery,
} from './endpoints/track.subtitle.translation.get/definition.js';
import { TRACK_SUBTITLE_TRANSLATION_GET_ENDPOINT } from './endpoints/track.subtitle.translation.get/definition.js';
import { MxmClientError } from './mxm-client.error.js';
import type {
  UnsafeGetMethod,
  UnsafePostMethod,
} from './mxm-client.factory.js';
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

  private createGet(endpoint: string) {
    return (input: {
      query: object;
      options?: MxmClientRequestOptions;
    }): Promise<MxmClientResponse<never>> => {
      return this.execute({
        endpoint,
        method: 'GET',
        query: input.query,
        options: input.options,
      });
    };
  }

  private createPost(
    endpoint: string,
    transformBody: (body: unknown) => unknown,
  ) {
    return (input: {
      query?: object;
      body: unknown;
      options?: MxmClientRequestOptions;
    }): Promise<MxmClientResponse<never>> => {
      return this.execute({
        endpoint,
        method: 'POST',
        query: input.query ?? {},
        body: transformBody(input.body),
        options: input.options,
      });
    };
  }

  // --- GET endpoints ---

  readonly albumGet: UnsafeGetMethod<AlbumGetQuery, MxmClientAlbumGetResponse> =
    this.createGet(ALBUM_GET_ENDPOINT);

  readonly albumTracksGet: UnsafeGetMethod<
    AlbumTracksGetQuery,
    MxmClientAlbumTracksGetResponse
  > = this.createGet(ALBUM_TRACKS_GET_ENDPOINT);

  readonly artistGet: UnsafeGetMethod<
    ArtistGetQuery,
    MxmClientArtistGetResponse
  > = this.createGet(ARTIST_GET_ENDPOINT);

  readonly artistSearch: UnsafeGetMethod<
    ArtistSearchQuery,
    MxmClientArtistSearchResponse
  > = this.createGet(ARTIST_SEARCH_ENDPOINT);

  readonly artistAlbumsGet: UnsafeGetMethod<
    ArtistAlbumsGetQuery,
    MxmClientArtistAlbumsGetResponse
  > = this.createGet(ARTIST_ALBUMS_GET_ENDPOINT);

  readonly chartTracksGet: UnsafeGetMethod<
    ChartTracksGetQuery,
    MxmClientChartTracksGetResponse
  > = this.createGet(CHART_TRACKS_GET_ENDPOINT);

  readonly chartArtistsGet: UnsafeGetMethod<
    ChartArtistsGetQuery,
    MxmClientChartArtistsGetResponse
  > = this.createGet(CHART_ARTISTS_GET_ENDPOINT);

  readonly languagesGet: UnsafeGetMethod<
    LanguagesGetQuery,
    MxmClientLanguagesGetResponse
  > = this.createGet(LANGUAGES_GET_ENDPOINT);

  readonly matcherLyricsGet: UnsafeGetMethod<
    MatcherLyricsGetQuery,
    MxmClientMatcherLyricsGetResponse
  > = this.createGet(MATCHER_LYRICS_GET_ENDPOINT);

  readonly matcherSubtitleGet: UnsafeGetMethod<
    MatcherSubtitleGetQuery,
    MxmClientMatcherSubtitleGetResponse
  > = this.createGet(MATCHER_SUBTITLE_GET_ENDPOINT);

  readonly matcherTrackGet: UnsafeGetMethod<
    MatcherTrackGetQuery,
    MxmClientMatcherTrackGetResponse
  > = this.createGet(MATCHER_TRACK_GET_ENDPOINT);

  readonly musicGenresGet: UnsafeGetMethod<
    MusicGenresGetQuery,
    MxmClientMusicGenresGetResponse
  > = this.createGet(MUSIC_GENRES_GET_ENDPOINT);

  readonly trackGet: UnsafeGetMethod<TrackGetQuery, MxmClientTrackGetResponse> =
    this.createGet(TRACK_GET_ENDPOINT);

  readonly trackLyricsGet: UnsafeGetMethod<
    TrackLyricsGetQuery,
    MxmClientTrackLyricsGetResponse
  > = this.createGet(TRACK_LYRICS_GET_ENDPOINT);

  readonly trackLyricsTranslationGet: UnsafeGetMethod<
    TrackLyricsTranslationGetQuery,
    MxmClientTrackLyricsTranslationGetResponse
  > = this.createGet(TRACK_LYRICS_TRANSLATION_GET_ENDPOINT);

  readonly trackSubtitleGet: UnsafeGetMethod<
    TrackSubtitleGetQuery,
    MxmClientTrackSubtitleGetResponse
  > = this.createGet(TRACK_SUBTITLE_GET_ENDPOINT);

  readonly trackSubtitleTranslationGet: UnsafeGetMethod<
    TrackSubtitleTranslationGetQuery,
    MxmClientTrackSubtitleTranslationGetResponse
  > = this.createGet(TRACK_SUBTITLE_TRANSLATION_GET_ENDPOINT);

  readonly trackRichSyncGet: UnsafeGetMethod<
    TrackRichSyncGetQuery,
    MxmClientTrackRichSyncGetResponse
  > = this.createGet(TRACK_RICHSYNC_GET_ENDPOINT);

  readonly trackSearch: UnsafeGetMethod<
    TrackSearchQuery,
    MxmClientTrackSearchResponse
  > = this.createGet(TRACK_SEARCH_ENDPOINT);

  readonly trackSnippetGet: UnsafeGetMethod<
    TrackSnippetGetQuery,
    MxmClientTrackSnippetGetResponse
  > = this.createGet(TRACK_SNIPPET_GET_ENDPOINT);

  // --- POST endpoints ---

  readonly trackLyricsFingerprintPost: UnsafePostMethod<
    TrackLyricsFingerprintPostQuery,
    TrackLyricsFingerprintPostBody,
    MxmClientTrackLyricsFingerprintPostResponse
  > = this.createPost(TRACK_LYRICS_FINGERPRINT_POST_ENDPOINT, (body) => ({
    data: { text: (body as TrackLyricsFingerprintPostBody).text },
  }));
}
