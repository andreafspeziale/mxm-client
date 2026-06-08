import t from 'tap';
import { buildLegacyAPIResponseSchema } from '../../mxm-client.schemas.js';
import { mxmClientAlbumTracksGetResponseSchema } from './definition.js';

const validResponse = {
  message: {
    header: {
      status_code: 200,
      execute_time: 0.015,
    },
    body: {
      track_list: [
        {
          track: {
            track_id: 170615520,
            track_isrc: 'GBAYE0601493',
            commontrack_isrcs: [['GBAYE0601493']],
            track_spotify_id: '4BRkPBUxOYffM2QXVlq7aC',
            track_name: 'Taxman - Remastered 2009',
            track_rating: 53,
            track_length: 159,
            commontrack_id: 70591,
            instrumental: 0,
            explicit: 0,
            has_lyrics: 1,
            has_subtitles: 1,
            has_richsync: 1,
            num_favourite: 298,
            album_id: 32540723,
            album_name: 'Revolver (Remastered)',
            artist_id: 160,
            artist_name: 'The Beatles',
            album_coverart_100x100:
              'http://s.mxmcdn.net/images-storage/albums/nocover.png',
            album_coverart_350x350: '',
            album_coverart_500x500: '',
            album_coverart_800x800: '',
            track_share_url:
              'https://www.musixmatch.com/lyrics/The-Beatles/taxman-remastered-2009',
            track_edit_url:
              'https://www.musixmatch.com/lyrics/The-Beatles/taxman-remastered-2009/edit',
            restricted: 0,
            updated_time: '2024-08-26T13:15:47Z',
            primary_genres: {
              music_genre_list: [
                {
                  music_genre: {
                    music_genre_id: 1133,
                    music_genre_parent_id: 14,
                    music_genre_name: 'Pop/Rock',
                    music_genre_name_extended: 'Pop / Pop/Rock',
                    music_genre_vanity: 'Pop-Pop-Rock',
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

t.test('album.tracks.get definition (spec)', (t) => {
  t.test('Should parse a valid response', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientAlbumTracksGetResponseSchema,
    );

    const result = schema.safeParse(validResponse);

    t.ok(result.success, 'Should parse successfully');
    t.strictSame(result.data, validResponse, 'Should match the fixture');
    t.end();
  });

  t.test('Should reject a response with missing required field', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientAlbumTracksGetResponseSchema,
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
