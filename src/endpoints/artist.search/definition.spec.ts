import t from 'tap';
import { buildLegacyAPIResponseSchema } from '../../mxm-client.schemas.js';
import { mxmClientArtistSearchResponseSchema } from './definition.js';

const validResponse = {
  message: {
    header: {
      status_code: 200,
      execute_time: 0.17,
    },
    body: {
      artist_list: [
        {
          artist: {
            artist_id: 259675,
            artist_name: 'Taylor Swift',
            artist_name_translation_list: [
              {
                artist_name_translation: {
                  language: 'JA',
                  translation: 'テイラー・スウィフト',
                },
              },
            ],
            artist_comment: '',
            artist_country: 'US',
            artist_alias_list: [
              { artist_alias: 'テイラー・スウィフト' },
              { artist_alias: 'Taylor Alison Swift' },
            ],
            artist_twitter_url: 'https://twitter.com/taylorswift13',
            artist_credits: {
              artist_list: [],
            },
            restricted: 0,
            updated_time: '2024-03-07T04:07:57Z',
            begin_date_year: '1989',
            begin_date: '1989-00-00',
            end_date_year: '',
            end_date: '0000-00-00',
          },
        },
      ],
    },
  },
};

t.test('artist.search definition (spec)', (t) => {
  t.test('Should parse a valid response', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientArtistSearchResponseSchema,
    );

    const result = schema.safeParse(validResponse);

    t.ok(result.success, 'Should parse successfully');
    t.strictSame(result.data, validResponse, 'Should match the fixture');
    t.end();
  });

  t.test('Should reject a response with missing required field', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientArtistSearchResponseSchema,
    );

    const invalidResponse = structuredClone(validResponse);
    // @ts-expect-error intentionally removing required field
    delete invalidResponse.message.body.artist_list[0].artist.artist_id;

    const result = schema.safeParse(invalidResponse);

    t.notOk(result.success, 'Should fail parsing');
    t.end();
  });

  t.end();
});
