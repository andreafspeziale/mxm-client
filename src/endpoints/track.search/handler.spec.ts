import t from 'tap';
import { MockAgent, setGlobalDispatcher } from 'undici';
import { MxmClientError } from '../../mxm-client.error.js';
import { buildUrl } from '../../mxm-client.utils.js';
import { METHOD, TRACK_SEARCH_ENDPOINT } from './constants.js';
import { trackSearch } from './handler.js';

const url = 'http://some-fake-url.example.com';
const mockAgent = new MockAgent();
mockAgent.disableNetConnect();

setGlobalDispatcher(mockAgent);

const client = mockAgent.get(url);

t.test('track.search (spec)', (t) => {
  t.test('Should return the expected response', async (t) => {
    const expectedResponse = {
      message: {
        header: {
          status_code: 200,
          execute_time: 0.345,
        },
        body: {
          track_list: [
            {
              track: {
                track_id: 123456,
                track_isrc: 'USUM71703861',
                commontrack_isrcs: [['USUM71703861']],
                track_spotify_id: '3n3Ppam7vgaVa1iaRUc9Lp',
                track_name: 'Hello',
                track_rating: 90,
                track_length: 295,
                commontrack_id: 789012,
                instrumental: 0,
                explicit: 0,
                has_lyrics: 1,
                has_subtitles: 1,
                has_richsync: 1,
                num_favourite: 1500,
                album_id: 345678,
                album_name: '25',
                artist_id: 901234,
                artist_name: 'Adele',
                album_coverart_100x100: 'https://example.com/cover_100.jpg',
                album_coverart_350x350: 'https://example.com/cover_350.jpg',
                album_coverart_500x500: 'https://example.com/cover_500.jpg',
                album_coverart_800x800: 'https://example.com/cover_800.jpg',
                track_share_url: 'https://www.musixmatch.com/...',
                track_edit_url: 'https://www.musixmatch.com/.../edit',
                restricted: 0,
                updated_time: '2024-03-25T21:52:49Z',
                primary_genres: {
                  music_genre_list: [
                    {
                      music_genre: {
                        music_genre_id: 14,
                        music_genre_name: 'Pop',
                        music_genre_name_extended: 'Pop',
                        music_genre_parent_id: 0,
                        music_genre_vanity: 'Pop',
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    };

    const query = {
      apiKey: 'fake-api-key',
      q_track: 'Hello',
      q_artist: 'Adele',
    };

    const path = await buildUrl({
      endpoint: TRACK_SEARCH_ENDPOINT,
      query,
      method: METHOD,
      errorToBeInitialized: MxmClientError,
    });

    client
      .intercept({
        path,
        method: METHOD,
      })
      .reply(200, expectedResponse);

    const r = await trackSearch({
      input: { query },
      client,
    });

    t.strictSame(r, expectedResponse, 'Should return the expected response');
  });

  t.test('Should throw when api-key is not provided', async (t) => {
    const query = {
      q_track: 'Hello',
      q_artist: 'Adele',
    };

    await t.rejects(
      trackSearch({
        input: { query },
        client,
      }),
      {
        message: 'API key is required',
      },
    );
  });

  t.test('Should throw when unexpected statusCode', async (t) => {
    const statusCode = 500;

    const query = {
      apiKey: 'fake-api-key',
      q_track: 'Hello',
      q_artist: 'Adele',
    };

    const path = await buildUrl({
      endpoint: TRACK_SEARCH_ENDPOINT,
      query,
      method: METHOD,
      errorToBeInitialized: MxmClientError,
    });

    client
      .intercept({
        path,
        method: METHOD,
      })
      .reply(statusCode, {});

    await t.rejects(
      trackSearch({
        input: { query },
        client,
      }),
      {
        message: `Unexpected statusCode, received ${statusCode}`,
      },
    );
  });

  t.test(
    'Should throw when correct statusCode but unexpected response message statusCode',
    async (t) => {
      const response = {
        message: {
          header: {
            status_code: 500,
            execute_time: 0.345,
          },
          body: {},
        },
      };

      const query = {
        apiKey: 'fake-api-key',
        q_track: 'Hello',
        q_artist: 'Adele',
      };

      const path = await buildUrl({
        endpoint: TRACK_SEARCH_ENDPOINT,
        query,
        method: METHOD,
        errorToBeInitialized: MxmClientError,
      });

      client
        .intercept({
          path,
          method: METHOD,
        })
        .reply(200, response);

      await t.rejects(
        trackSearch({
          input: { query },
          client,
        }),
        {
          message: 'Unexpected response data shape',
        },
      );
    },
  );

  t.test(
    'Should throw when correct statusCode, correct response message statusCode but unexpected response shape',
    async (t) => {
      const response = {
        message: {
          header: {
            status_code: 200,
            execute_time: 0.345,
          },
          body: {
            track_list: [
              {
                track: {
                  track_id: '123456', // String instead of number - wrong type
                  track_isrc: 'USUM71703861',
                  commontrack_isrcs: [['USUM71703861']],
                  track_spotify_id: '3n3Ppam7vgaVa1iaRUc9Lp',
                  track_name: 'Hello',
                  track_rating: 90,
                  track_length: 295,
                  commontrack_id: 789012,
                  instrumental: 0,
                  explicit: 0,
                  has_lyrics: 1,
                  has_subtitles: 1,
                  has_richsync: 1,
                  num_favourite: 1500,
                  album_id: 345678,
                  album_name: '25',
                  artist_id: 901234,
                  artist_name: 'Adele',
                  album_coverart_100x100: 'https://example.com/cover_100.jpg',
                  album_coverart_350x350: 'https://example.com/cover_350.jpg',
                  album_coverart_500x500: 'https://example.com/cover_500.jpg',
                  album_coverart_800x800: 'https://example.com/cover_800.jpg',
                  track_share_url: 'https://www.musixmatch.com/...',
                  track_edit_url: 'https://www.musixmatch.com/.../edit',
                  restricted: 0,
                  updated_time: '2024-03-25T21:52:49Z',
                  primary_genres: {
                    music_genre_list: [
                      {
                        music_genre: {
                          music_genre_id: 14,
                          music_genre_name: 'Pop',
                          music_genre_name_extended: 'Pop',
                          music_genre_parent_id: 0,
                          music_genre_vanity: 'Pop',
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      };

      const query = {
        apiKey: 'fake-api-key',
        q_track: 'Hello',
        q_artist: 'Adele',
      };

      const path = await buildUrl({
        endpoint: TRACK_SEARCH_ENDPOINT,
        query,
        method: METHOD,
        errorToBeInitialized: MxmClientError,
      });

      client
        .intercept({
          path,
          method: METHOD,
        })
        .reply(200, response);

      await t.rejects(
        trackSearch({
          input: { query },
          client,
        }),
        {
          message: 'Unexpected response data shape',
        },
      );
    },
  );

  t.test('Should throw for an unexpected error', async (t) => {
    const query = {
      apiKey: 'fake-api-key',
      q_track: 'Hello',
      q_artist: 'Adele',
    };

    const path = await buildUrl({
      endpoint: TRACK_SEARCH_ENDPOINT,
      query,
      method: METHOD,
      errorToBeInitialized: MxmClientError,
    });

    client
      .intercept({
        path,
        method: METHOD,
      })
      .replyWithError(new Error('Unexpected error'));

    await t.rejects(
      trackSearch({
        input: { query },
        client,
      }),
      {
        message: 'Something went wrong during the request',
      },
    );
  });

  t.end();
});
