import t from 'tap';
import { buildLegacyAPIResponseSchema } from '../../mxm-client.schemas.js';
import { mxmClientTrackRichSyncGetResponseSchema } from './definition.js';

const validResponse = {
  message: {
    header: {
      status_code: 200,
      execute_time: 0.345,
    },
    body: {
      richsync: {
        richsync_id: 101,
        restricted: 0,
        richsync_body: '[{"ts":1.5,"te":3.2,"l":[{"c":"Hello","o":0}]}]',
        lyrics_copyright: 'Lyrics powered by www.musixmatch.com',
        richsync_length: 210,
        richssync_language: 'en',
        richsync_language_description: 'English',
        richsync_avg_count: 5,
        script_tracking_url: 'https://tracking.musixmatch.com/script',
        pixel_tracking_url: 'https://tracking.musixmatch.com/pixel',
        html_tracking_url: 'https://tracking.musixmatch.com/html',
        writer_list: [],
        publisher_list: [],
        updated_time: '2025-04-29T13:45:37Z',
      },
    },
  },
};

t.test('track.richsync.get definition (spec)', (t) => {
  t.test('Should parse a valid response', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientTrackRichSyncGetResponseSchema,
    );

    const result = schema.safeParse(validResponse);

    t.ok(result.success, 'Should parse successfully');
    t.strictSame(result.data, validResponse, 'Should match the fixture');
    t.end();
  });

  t.test('Should reject a response with missing required field', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientTrackRichSyncGetResponseSchema,
    );

    const invalidResponse = structuredClone(validResponse);
    // @ts-expect-error intentionally removing required field
    delete invalidResponse.message.body.richsync.richsync_id;

    const result = schema.safeParse(invalidResponse);

    t.notOk(result.success, 'Should fail parsing');
    t.end();
  });

  t.end();
});
