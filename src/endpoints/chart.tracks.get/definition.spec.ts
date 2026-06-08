import t from 'tap';
import { buildLegacyAPIResponseSchema } from '../../mxm-client.schemas.js';
import { mxmClientChartTracksGetResponseSchema } from './definition.js';

const validResponse = {
  message: {
    header: {
      status_code: 200,
      execute_time: 0.023429870605469,
    },
    body: {
      track_list: [
        {
          track: {
            track_id: 446294165,
            track_isrc: 'USWD12641056',
            commontrack_isrcs: [['USWD12641056']],
            track_spotify_id: '',
            track_name: 'I Knew It, I Knew You (Acoustic Version)',
            track_rating: 1,
            track_length: 0,
            commontrack_id: 274648031,
            instrumental: 0,
            explicit: 0,
            has_lyrics: 1,
            has_subtitles: 1,
            has_richsync: 1,
            num_favourite: 0,
            album_id: 105756685,
            album_name: 'I Knew It, I Knew You (Acoustic Version)',
            artist_id: 91838568,
            artist_name: 'Taylor Swift',
            album_coverart_100x100:
              'http://s.mxmcdn.net/images-storage/albums/nocover.png',
            album_coverart_350x350: '',
            album_coverart_500x500: '',
            album_coverart_800x800: '',
            track_share_url:
              'https://www.musixmatch.com/lyrics/Taylor-Swift-36/I-Knew-It-I-Knew-You-Acoustic-Version',
            track_edit_url:
              'https://www.musixmatch.com/lyrics/Taylor-Swift-36/I-Knew-It-I-Knew-You-Acoustic-Version/edit',
            restricted: 0,
            updated_time: '2026-06-07T18:16:07Z',
            primary_genres: {
              music_genre_list: [],
            },
            track_lyrics_translation_status: [],
            track_lyrics_translation_options: {
              contribution_blocked: 0,
            },
          },
        },
      ],
    },
  },
};

const validResponseWithGenres = {
  message: {
    header: {
      status_code: 200,
      execute_time: 0.022877931594849,
    },
    body: {
      track_list: [
        {
          track: {
            track_id: 256504402,
            track_isrc: 'INUM72300284',
            commontrack_isrcs: [['INUM72300284']],
            track_spotify_id: '51DEaelXeJJ6cFFYbX8Hal',
            track_name: 'Zihaal e Miskin',
            track_rating: 58,
            track_length: 0,
            commontrack_id: 159295013,
            instrumental: 0,
            explicit: 0,
            has_lyrics: 1,
            has_subtitles: 1,
            has_richsync: 0,
            num_favourite: 14,
            album_id: 57187446,
            album_name: 'Zihaal e Miskin',
            artist_id: 56348574,
            artist_name: 'Javed-Mohsin feat. Vishal Mishra & Shreya Ghoshal',
            album_coverart_100x100:
              'http://s.mxmcdn.net/images-storage/albums/nocover.png',
            album_coverart_350x350: '',
            album_coverart_500x500: '',
            album_coverart_800x800: '',
            track_share_url:
              'https://www.musixmatch.com/lyrics/Javed-Mohsin-Vishal-Mishra-Shreya-Ghoshal/Zihaal-e-Miskin',
            track_edit_url:
              'https://www.musixmatch.com/lyrics/Javed-Mohsin-Vishal-Mishra-Shreya-Ghoshal/Zihaal-e-Miskin/edit',
            restricted: 0,
            updated_time: '2026-04-02T07:45:34Z',
            primary_genres: {
              music_genre_list: [
                {
                  music_genre: {
                    music_genre_id: 1262,
                    music_genre_parent_id: 34,
                    music_genre_name: 'Indian',
                    music_genre_name_extended: 'Indian',
                    music_genre_vanity: 'Indian',
                  },
                },
              ],
            },
            track_lyrics_translation_status: [
              {
                from: 'hi',
                to: 'en',
                perc: 1,
              },
            ],
            track_lyrics_translation_options: {
              contribution_blocked: 0,
            },
          },
        },
      ],
    },
  },
};

t.test('chart.tracks.get definition (spec)', (t) => {
  t.test('Should parse a valid response', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientChartTracksGetResponseSchema,
    );

    const result = schema.safeParse(validResponse);

    t.ok(result.success, 'Should parse successfully');
    t.strictSame(result.data, validResponse, 'Should match the fixture');
    t.end();
  });

  t.test('Should parse a valid response with genres', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientChartTracksGetResponseSchema,
    );

    const result = schema.safeParse(validResponseWithGenres);

    t.ok(result.success, 'Should parse successfully');
    t.strictSame(
      result.data,
      validResponseWithGenres,
      'Should match the fixture',
    );
    t.end();
  });

  t.test('Should reject a response with missing required field', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientChartTracksGetResponseSchema,
    );

    const invalidResponse = structuredClone(validResponse);
    // @ts-expect-error intentionally removing required field
    delete invalidResponse.message.body.track_list[0].track.track_id;

    const result = schema.safeParse(invalidResponse);

    t.notOk(result.success, 'Should fail parsing');
    t.end();
  });

  t.end();
});
