import t from 'tap';
import { buildLegacyAPIResponseSchema } from '../../mxm-client.schemas.js';
import { mxmClientMusicGenresGetResponseSchema } from './definition.js';

const validResponse = {
  message: {
    header: {
      status_code: 200,
      execute_time: 0.064568996429443,
    },
    body: {
      music_genre_list: [
        {
          music_genre: {
            music_genre_id: 34,
            music_genre_parent_id: 0,
            music_genre_name: 'Music',
            music_genre_name_extended: 'Music',
            music_genre_vanity: 'Music',
          },
        },
        {
          music_genre: {
            music_genre_id: 14,
            music_genre_parent_id: 34,
            music_genre_name: 'Pop',
            music_genre_name_extended: 'Pop',
            music_genre_vanity: 'Pop',
          },
        },
        {
          music_genre: {
            music_genre_id: 1007,
            music_genre_parent_id: 2,
            music_genre_name: 'Chicago Blues',
            music_genre_name_extended: 'Blues / Chicago Blues',
            music_genre_vanity: 'Blues-Chicago-Blues',
          },
        },
      ],
    },
  },
};

t.test('music.genres.get definition (spec)', (t) => {
  t.test('Should parse a valid response', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientMusicGenresGetResponseSchema,
    );

    const result = schema.safeParse(validResponse);

    t.ok(result.success, 'Should parse successfully');
    t.strictSame(result.data, validResponse, 'Should match the fixture');
    t.end();
  });

  t.test('Should reject a response with missing required field', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientMusicGenresGetResponseSchema,
    );

    const invalidResponse = structuredClone(validResponse);
    // @ts-expect-error intentionally removing required field
    delete invalidResponse.message.body.music_genre_list[0].music_genre
      .music_genre_id;

    const result = schema.safeParse(invalidResponse);

    t.notOk(result.success, 'Should fail parsing');
    t.end();
  });

  t.end();
});
