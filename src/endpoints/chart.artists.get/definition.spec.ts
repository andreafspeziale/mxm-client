import t from 'tap';
import { buildLegacyAPIResponseSchema } from '../../mxm-client.schemas.js';
import { mxmClientChartArtistsGetResponseSchema } from './definition.js';

const validResponse = {
  message: {
    header: {
      status_code: 200,
      execute_time: 0.017751932144165,
    },
    body: {
      artist_list: [
        {
          artist: {
            artist_id: 36034079,
            artist_name: 'Ella Langley',
            artist_name_translation_list: [],
            artist_comment: '',
            artist_country: '',
            artist_alias_list: [],
            artist_twitter_url: '',
            artist_credits: {
              artist_list: [],
            },
            restricted: 0,
            updated_time: '2021-11-17T21:56:37Z',
            begin_date_year: '1970',
            begin_date: '1970-00-00',
            end_date_year: '',
            end_date: '0000-00-00',
          },
        },
        {
          artist: {
            artist_id: 295,
            artist_name: 'Michael Jackson',
            artist_name_translation_list: [],
            artist_comment: '',
            artist_country: 'US',
            artist_alias_list: [
              { artist_alias: 'マイケルジャクソン' },
              { artist_alias: 'Michael Joseph Jackson' },
            ],
            artist_twitter_url: 'https://twitter.com/michaeljackson',
            artist_credits: {
              artist_list: [],
            },
            restricted: 0,
            updated_time: '2024-11-14T10:16:14Z',
            begin_date_year: '1958',
            begin_date: '1958-08-29',
            end_date_year: '2009',
            end_date: '2009-06-25',
          },
        },
      ],
    },
  },
};

t.test('chart.artists.get definition (spec)', (t) => {
  t.test('Should parse a valid response', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientChartArtistsGetResponseSchema,
    );

    const result = schema.safeParse(validResponse);

    t.ok(result.success, 'Should parse successfully');
    t.strictSame(result.data, validResponse, 'Should match the fixture');
    t.end();
  });

  t.test('Should reject a response with missing required field', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientChartArtistsGetResponseSchema,
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
