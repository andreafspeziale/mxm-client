import t from 'tap';
import { buildLegacyAPIResponseSchema } from '../../mxm-client.schemas.js';
import { mxmClientMatcherSubtitleGetResponseSchema } from './definition.js';

const validResponse = {
  message: {
    header: {
      status_code: 200,
      execute_time: 0.345,
    },
    body: {
      subtitle: {
        subtitle_id: 789,
        subtitle_body: '[{"text":"Hello","time":{"total":1.5}}]',
        lyrics_copyright: 'Lyrics powered by www.musixmatch.com',
        subtitle_length: 210,
        subtitle_language: 'en',
        subtitle_language_description: 'English',
        script_tracking_url: 'https://tracking.musixmatch.com/script',
        pixel_tracking_url: 'https://tracking.musixmatch.com/pixel',
        updated_time: '2025-04-29T13:45:37Z',
      },
    },
  },
};

t.test('matcher.subtitle.get definition (spec)', (t) => {
  t.test('Should parse a valid response', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientMatcherSubtitleGetResponseSchema,
    );

    const result = schema.safeParse(validResponse);

    t.ok(result.success, 'Should parse successfully');
    t.strictSame(result.data, validResponse, 'Should match the fixture');
    t.end();
  });

  t.test('Should reject a response with missing required field', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientMatcherSubtitleGetResponseSchema,
    );

    const invalidResponse = structuredClone(validResponse);
    // @ts-expect-error intentionally removing required field
    delete invalidResponse.message.body.subtitle.subtitle_id;

    const result = schema.safeParse(invalidResponse);

    t.notOk(result.success, 'Should fail parsing');
    t.end();
  });

  t.end();
});
