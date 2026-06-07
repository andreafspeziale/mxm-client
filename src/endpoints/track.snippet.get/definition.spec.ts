import t from 'tap';
import { buildLegacyAPIResponseSchema } from '../../mxm-client.schemas.js';
import { mxmClientTrackSnippetGetResponseSchema } from './definition.js';

const validResponse = {
  message: {
    header: {
      status_code: 200,
      execute_time: 0.345,
    },
    body: {
      snippet: {
        snippet_id: 36997817,
        snippet_body: "But if it's forever, it's even better",
        snippet_language: 'en',
        instrumental: 0,
        restricted: 0,
        updated_time: '2025-01-23T01:30:54Z',
        html_tracking_url: 'https://tracking.musixmatch.com/t1.0/m_html',
        pixel_tracking_url: 'https://tracking.musixmatch.com/t1.0/m_img',
        script_tracking_url: 'https://tracking.musixmatch.com/t1.0/m_js',
      },
    },
  },
};

t.test('track.snippet.get definition (spec)', (t) => {
  t.test('Should parse a valid response', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientTrackSnippetGetResponseSchema,
    );

    const result = schema.safeParse(validResponse);

    t.ok(result.success, 'Should parse successfully');
    t.strictSame(result.data, validResponse, 'Should match the fixture');
    t.end();
  });

  t.test('Should reject a response with missing required field', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientTrackSnippetGetResponseSchema,
    );

    const invalidResponse = structuredClone(validResponse);
    // @ts-expect-error intentionally removing required field
    delete invalidResponse.message.body.snippet.snippet_id;

    const result = schema.safeParse(invalidResponse);

    t.notOk(result.success, 'Should fail parsing');
    t.end();
  });

  t.end();
});
