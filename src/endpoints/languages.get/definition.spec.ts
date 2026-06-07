import t from 'tap';
import { buildLegacyAPIResponseSchema } from '../../mxm-client.schemas.js';
import { mxmClientLanguagesGetResponseSchema } from './definition.js';

const validResponseBase = {
  message: {
    header: {
      status_code: 200,
      execute_time: 0.0048348903656006,
    },
    body: {
      language_list: [
        {
          language: {
            language_iso_code_1: 'en',
            language_iso_code_3: 'eng',
            language_name: 'english',
          },
        },
        {
          language: {
            language_iso_code_1: 'it',
            language_iso_code_3: 'ita',
            language_name: 'italian',
          },
        },
      ],
    },
  },
};

const validResponseWithRomanization = {
  message: {
    header: {
      status_code: 200,
      execute_time: 0.0041508674621582,
    },
    body: {
      language_list: [
        {
          language: {
            language_iso_code_1: 'ja',
            language_iso_code_3: 'jpn',
            language_name: 'japanese',
            has_romanization: 1,
            iso_code_romanization: 'rj',
          },
        },
        {
          language: {
            language_iso_code_1: 'rj',
            language_iso_code_3: 'rja',
            language_name: 'japanese-romaji',
            is_romanized: 1,
          },
        },
        {
          language: {
            language_iso_code_1: 'en',
            language_iso_code_3: 'eng',
            language_name: 'english',
          },
        },
      ],
    },
  },
};

t.test('languages.get definition (spec)', (t) => {
  t.test('Should parse a valid response without romanization fields', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientLanguagesGetResponseSchema,
    );

    const result = schema.safeParse(validResponseBase);

    t.ok(result.success, 'Should parse successfully');
    t.strictSame(result.data, validResponseBase, 'Should match the fixture');
    t.end();
  });

  t.test('Should parse a valid response with romanization fields', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientLanguagesGetResponseSchema,
    );

    const result = schema.safeParse(validResponseWithRomanization);

    t.ok(result.success, 'Should parse successfully');
    t.strictSame(
      result.data,
      validResponseWithRomanization,
      'Should match the fixture',
    );
    t.end();
  });

  t.test('Should reject a response with missing required field', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientLanguagesGetResponseSchema,
    );

    const invalidResponse = structuredClone(validResponseBase);
    // @ts-expect-error intentionally removing required field
    delete invalidResponse.message.body.language_list[0].language
      .language_iso_code_1;

    const result = schema.safeParse(invalidResponse);

    t.notOk(result.success, 'Should fail parsing');
    t.end();
  });

  t.end();
});
