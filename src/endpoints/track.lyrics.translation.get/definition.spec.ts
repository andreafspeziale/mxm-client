import t from 'tap';
import { buildLegacyAPIResponseSchema } from '../../mxm-client.schemas.js';
import { mxmClientTrackLyricsTranslationGetResponseSchema } from './definition.js';

const validResponseWithTranslation = {
  message: {
    header: {
      status_code: 200,
      execute_time: 0.018592834472656,
    },
    body: {
      lyrics: {
        lyrics_id: 36997817,
        explicit: 1,
        lyrics_body: 'Some lyrics body text...',
        lyrics_language: 'en',
        script_tracking_url: 'https://tracking.musixmatch.com/script',
        pixel_tracking_url: 'https://tracking.musixmatch.com/pixel',
        lyrics_copyright: 'Lyrics powered by www.musixmatch.com',
        updated_time: '2025-01-23T01:30:54Z',
        region_restriction: {
          allowed: ['XW'],
          blocked: [],
        },
        lyrics_translated: {
          lyrics_body: 'Translated lyrics body text...',
          script_tracking_url:
            'https://tracking.musixmatch.com/script-translated',
          pixel_tracking_url:
            'https://tracking.musixmatch.com/pixel-translated',
          html_tracking_url: 'https://tracking.musixmatch.com/html-translated',
          selected_language: 'it',
          restricted: 0,
        },
      },
    },
  },
};

const validResponseWithEmptyTranslation = {
  message: {
    header: {
      status_code: 200,
      execute_time: 0.048251867294312,
    },
    body: {
      lyrics: {
        lyrics_id: 45782596,
        explicit: 1,
        lyrics_body: 'Some lyrics body text...',
        lyrics_language: 'en',
        script_tracking_url: 'https://tracking.musixmatch.com/script',
        pixel_tracking_url: 'https://tracking.musixmatch.com/pixel',
        lyrics_copyright: 'Lyrics powered by www.musixmatch.com',
        updated_time: '2026-04-16T11:25:43Z',
        region_restriction: {
          allowed: ['XW'],
          blocked: [],
        },
        lyrics_translated: {},
      },
    },
  },
};

t.test('track.lyrics.translation.get definition (spec)', (t) => {
  t.test('Should parse a valid response with translation', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientTrackLyricsTranslationGetResponseSchema,
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
      mxmClientTrackLyricsTranslationGetResponseSchema,
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
      mxmClientTrackLyricsTranslationGetResponseSchema,
    );

    const invalidResponse = structuredClone(validResponseWithTranslation);
    // @ts-expect-error intentionally removing required field
    delete invalidResponse.message.body.lyrics.lyrics_id;

    const result = schema.safeParse(invalidResponse);

    t.notOk(result.success, 'Should fail parsing');
    t.end();
  });

  t.test('Should reject a response with partial lyrics_translated', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientTrackLyricsTranslationGetResponseSchema,
    );

    const invalidResponse = structuredClone(validResponseWithTranslation);
    // @ts-expect-error intentionally removing required field
    delete invalidResponse.message.body.lyrics.lyrics_translated.lyrics_body;

    const result = schema.safeParse(invalidResponse);

    t.notOk(result.success, 'Should fail parsing');
    t.end();
  });

  t.end();
});
