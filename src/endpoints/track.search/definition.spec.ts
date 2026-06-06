import t from 'tap';
import { buildLegacyAPIResponseSchema } from '../../mxm-client.schemas.js';
import { mxmClientTrackSearchResponseSchema } from './definition.js';

const validResponse = {
  message: {
    header: {
      status_code: 200,
      execute_time: 0.345,
    },
    body: {
      track_list: [
        {
          track: {
            track_id: 123,
            track_isrc: 'ISRC_123',
            commontrack_isrcs: [['ISRC_123']],
            track_spotify_id: 'SPOTIFY_ID_123',
            track_name: 'Hello',
            track_rating: 1,
            track_length: 1,
            commontrack_id: 1,
            instrumental: 0,
            explicit: 0,
            has_lyrics: 1,
            has_subtitles: 1,
            has_richsync: 1,
            num_favourite: 1,
            album_id: 1,
            album_name: 'ALBUM_NAME',
            artist_id: 1,
            artist_name: 'Andrea',
            album_coverart_100x100:
              'http://s.mxmcdn.net/images-storage/albums/nocover.png',
            album_coverart_350x350: '',
            album_coverart_500x500: '',
            album_coverart_800x800: '',
            track_share_url: 'https://www.musixmatch.com/lyrics/...',
            track_edit_url: 'https://www.musixmatch.com/lyrics/...',
            restricted: 0,
            updated_time: '2025-04-29T13:45:37Z',
            primary_genres: {
              music_genre_list: [
                {
                  music_genre: {
                    music_genre_id: 14,
                    music_genre_parent_id: 34,
                    music_genre_name: 'Pop',
                    music_genre_name_extended: 'Pop',
                    music_genre_vanity: 'Po',
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

t.test('track.search definition (spec)', (t) => {
  t.test('Should parse a valid response', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientTrackSearchResponseSchema,
    );

    const result = schema.safeParse(validResponse);

    t.ok(result.success, 'Should parse successfully');
    t.strictSame(result.data, validResponse, 'Should match the fixture');
    t.end();
  });

  t.test('Should reject a response with missing required field', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientTrackSearchResponseSchema,
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
