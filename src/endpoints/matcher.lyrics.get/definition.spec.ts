import t from 'tap';
import { buildLegacyAPIResponseSchema } from '../../mxm-client.schemas.js';
import { mxmClientMatcherLyricsGetResponseSchema } from './definition.js';

const validResponse = {
  message: {
    header: {
      status_code: 200,
      execute_time: 0.345,
    },
    body: {
      lyrics: {
        explicit: 0,
        lyrics_body: 'Some lyrics body text...',
        lyrics_copyright: 'Lyrics powered by www.musixmatch.com',
        lyrics_id: 456,
        lyrics_language: 'en',
        pixel_tracking_url: 'https://tracking.musixmatch.com/pixel',
        script_tracking_url: 'https://tracking.musixmatch.com/script',
        updated_time: '2025-04-29T13:45:37Z',
      },
    },
  },
};

t.test('matcher.lyrics.get definition (spec)', (t) => {
  t.test('Should parse a valid response', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientMatcherLyricsGetResponseSchema,
    );

    const result = schema.safeParse(validResponse);

    t.ok(result.success, 'Should parse successfully');
    t.strictSame(result.data, validResponse, 'Should match the fixture');
    t.end();
  });

  t.test('Should reject a response with missing required field', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientMatcherLyricsGetResponseSchema,
    );

    const invalidResponse = structuredClone(validResponse);
    // @ts-expect-error intentionally removing required field
    delete invalidResponse.message.body.lyrics.lyrics_id;

    const result = schema.safeParse(invalidResponse);

    t.notOk(result.success, 'Should fail parsing');
    t.end();
  });

  t.end();
});
