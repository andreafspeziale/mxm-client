import t from 'tap';
import { buildLegacyAPIResponseSchema } from '../../mxm-client.schemas.js';
import { mxmClientTrackSubtitleTranslationGetResponseSchema } from './definition.js';

const validResponseWithTranslation = {
  message: {
    header: {
      status_code: 200,
      execute_time: 0.01508092880249,
    },
    body: {
      subtitle: {
        subtitle_id: 41989496,
        subtitle_body:
          "[00:00.47] ('Til I'm in the grave)\n[00:03.65] I want you to stay\n",
        lyrics_copyright:
          "Writer(s): Finneas Baird O'connell, Billie Eilish O'connell\nCopyright: Universal Music Works, Drup, Last Frontier\nLyrics powered by www.musixmatch.com",
        subtitle_length: 210,
        subtitle_language: 'en',
        subtitle_language_description: 'English',
        script_tracking_url: 'https://tracking.musixmatch.com/t1.0/m_js/script',
        pixel_tracking_url: 'https://tracking.musixmatch.com/t1.0/m_img/pixel',
        updated_time: '2026-05-15T05:29:27Z',
        region_restriction: {
          allowed: ['XW'],
          blocked: [],
        },
        subtitle_translated: {
          restricted: 0,
          subtitle_body:
            '[00:00.47] (直到我葬身墓中)\n[00:03.65] 我想要你驻留\n',
          selected_language: 'zh',
          script_tracking_url:
            'https://tracking.musixmatch.com/t1.0/m_js/script-translated',
          pixel_tracking_url:
            'https://tracking.musixmatch.com/t1.0/m_img/pixel-translated',
          html_tracking_url:
            'https://tracking.musixmatch.com/t1.0/m_html/html-translated',
        },
      },
    },
  },
};

const validResponseWithEmptyTranslation = {
  message: {
    header: {
      status_code: 200,
      execute_time: 0.011867046356201,
    },
    body: {
      subtitle: {
        subtitle_id: 41989496,
        subtitle_body:
          "[00:00.47] ('Til I'm in the grave)\n[00:03.65] I want you to stay\n",
        lyrics_copyright:
          "Writer(s): Finneas Baird O'connell, Billie Eilish O'connell\nCopyright: Universal Music Works, Drup, Last Frontier\nLyrics powered by www.musixmatch.com",
        subtitle_length: 210,
        subtitle_language: 'en',
        subtitle_language_description: 'English',
        script_tracking_url: 'https://tracking.musixmatch.com/t1.0/m_js/script',
        pixel_tracking_url: 'https://tracking.musixmatch.com/t1.0/m_img/pixel',
        updated_time: '2026-05-15T05:29:27Z',
        region_restriction: {
          allowed: ['XW'],
          blocked: [],
        },
        subtitle_translated: {},
      },
    },
  },
};

t.test('track.subtitle.translation.get definition (spec)', (t) => {
  t.test('Should parse a valid response with translation', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientTrackSubtitleTranslationGetResponseSchema,
    );

    const result = schema.safeParse(validResponseWithTranslation);

    t.ok(result.success, 'Should parse successfully');
    t.strictSame(
      result.data,
      validResponseWithTranslation,
      'Should match the fixture',
    );
    t.end();
  });

  t.test('Should parse a valid response with empty translation', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientTrackSubtitleTranslationGetResponseSchema,
    );

    const result = schema.safeParse(validResponseWithEmptyTranslation);

    t.ok(result.success, 'Should parse successfully');
    t.strictSame(
      result.data,
      validResponseWithEmptyTranslation,
      'Should match the fixture',
    );
    t.end();
  });

  t.test('Should reject a response with missing required field', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientTrackSubtitleTranslationGetResponseSchema,
    );

    const invalidResponse = structuredClone(validResponseWithTranslation);
    // @ts-expect-error intentionally removing required field
    delete invalidResponse.message.body.subtitle.subtitle_id;

    const result = schema.safeParse(invalidResponse);

    t.notOk(result.success, 'Should fail parsing');
    t.end();
  });

  t.test('Should reject a response with partial subtitle_translated', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientTrackSubtitleTranslationGetResponseSchema,
    );

    const invalidResponse = structuredClone(validResponseWithTranslation);
    // @ts-expect-error intentionally removing required field
    delete invalidResponse.message.body.subtitle.subtitle_translated
      .subtitle_body;

    const result = schema.safeParse(invalidResponse);

    t.notOk(result.success, 'Should fail parsing');
    t.end();
  });

  t.end();
});
