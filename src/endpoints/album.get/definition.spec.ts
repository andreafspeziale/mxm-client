import t from 'tap';
import { buildLegacyAPIResponseSchema } from '../../mxm-client.schemas.js';
import { mxmClientAlbumGetResponseSchema } from './definition.js';

const validResponse = {
  message: {
    header: {
      status_code: 200,
      execute_time: 0.018296003341675,
    },
    body: {
      album: {
        album_id: 56126508,
        album_name: "Did you know that there's a tunnel under Ocean Blvd",
        album_release_date: '2023-03-24',
        artist_id: 13805436,
        artist_name: 'Lana Del Rey',
        album_pline:
          'A Polydor Records Release / An Interscope Records Release in the USA; \u2117 2023 Lana Del Rey, under exclusive licence to Universal Music Operations Limited',
        album_copyright:
          'A Polydor Records Release / An Interscope Records Release in the USA; \u2117 2023 Lana Del Rey, under exclusive licence to Universal Music Operations Limited',
        album_label: 'Polydor Records',
        restricted: 0,
        updated_time: '2026-06-01T13:10:06Z',
      },
    },
  },
};

t.test('album.get definition (spec)', (t) => {
  t.test('Should parse a valid response', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientAlbumGetResponseSchema,
    );

    const result = schema.safeParse(validResponse);

    t.ok(result.success, 'Should parse successfully');
    t.strictSame(result.data, validResponse, 'Should match the fixture');
    t.end();
  });

  t.test('Should reject a response with missing required field', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientAlbumGetResponseSchema,
    );

    const invalidResponse = structuredClone(validResponse);
    // @ts-expect-error intentionally removing required field
    delete invalidResponse.message.body.album.album_id;

    const result = schema.safeParse(invalidResponse);

    t.notOk(result.success, 'Should fail parsing');
    t.end();
  });

  t.end();
});
