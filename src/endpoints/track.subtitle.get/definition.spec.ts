import t from 'tap';
import { buildLegacyAPIResponseSchema } from '../../mxm-client.schemas.js';
import { mxmClientTrackSubtitleGetResponseSchema } from './definition.js';

const validResponse = {
  message: {
    header: {
      status_code: 200,
      execute_time: 0.345,
    },
    body: {
      subtitle: {
        lyrics_copyright: 'Lyrics powered by www.musixmatch.com',
        pixel_tracking_url: 'https://tracking.musixmatch.com/pixel',
        script_tracking_url: 'https://tracking.musixmatch.com/script',
        subtitle_body: '[{"text":"Hello","time":{"total":1.5}}]',
        subtitle_id: 789,
        subtitle_language: 'en',
        subtitle_language_description: 'English',
        subtitle_length: 210,
        updated_time: '2025-04-29T13:45:37Z',
      },
    },
  },
};

t.test('track.subtitle.get definition (spec)', (t) => {
  t.test('Should parse a valid response', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientTrackSubtitleGetResponseSchema,
    );

    const result = schema.safeParse(validResponse);

    t.ok(result.success, 'Should parse successfully');
    t.strictSame(result.data, validResponse, 'Should match the fixture');
    t.end();
  });

  t.test('Should reject a response with missing required field', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientTrackSubtitleGetResponseSchema,
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
