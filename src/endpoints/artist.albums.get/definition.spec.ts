import t from 'tap';
import { buildLegacyAPIResponseSchema } from '../../mxm-client.schemas.js';
import { mxmClientArtistAlbumsGetResponseSchema } from './definition.js';

const validResponse = {
  message: {
    header: {
      status_code: 200,
      execute_time: 0.036,
    },
    body: {
      album_list: [
        {
          album: {
            album_id: 48110510,
            album_name: '30',
            album_release_date: '2021-11-19',
            artist_id: 346898,
            artist_name: 'Adele',
            album_pline:
              '(P) 2021 Melted Stone under exclusive license to Columbia Records, a Division of Sony Music Entertainment',
            album_copyright:
              '(P) 2021 Melted Stone under exclusive license to Columbia Records, a Division of Sony Music Entertainment',
            album_label: 'Columbia',
            restricted: 0,
            updated_time: '2026-05-12T19:50:20Z',
          },
        },
        {
          album: {
            album_id: 47384581,
            album_name: 'Easy On Me',
            album_release_date: '2022-08-20',
            artist_id: 346898,
            artist_name: 'Adele',
            album_pline: '2022 Jack Russels Halsband',
            album_copyright: '2022 Jack Russels Halsband',
            album_label: 'Columbia,recordJet',
            restricted: 0,
            updated_time: '2026-04-04T12:52:58Z',
          },
        },
      ],
    },
  },
};

t.test('artist.albums.get definition (spec)', (t) => {
  t.test('Should parse a valid response', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientArtistAlbumsGetResponseSchema,
    );

    const result = schema.safeParse(validResponse);

    t.ok(result.success, 'Should parse successfully');
    t.strictSame(result.data, validResponse, 'Should match the fixture');
    t.end();
  });

  t.test('Should reject a response with missing required field', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientArtistAlbumsGetResponseSchema,
    );

    const invalidResponse = structuredClone(validResponse);
    // @ts-expect-error intentionally removing required field
    delete invalidResponse.message.body.album_list[0].album.album_id;

    const result = schema.safeParse(invalidResponse);

    t.notOk(result.success, 'Should fail parsing');
    t.end();
  });

  t.end();
});
