import t from 'tap';
import { buildLegacyAPIResponseSchema } from '../../mxm-client.schemas.js';
import { mxmClientTrackLyricsAnalysisGetResponseSchema } from './definition.js';

const validResponse = {
  message: {
    header: {
      status_code: 200,
      execute_time: 0.051170110702515,
    },
    body: {
      analysis: {
        themes: {
          main_themes: [
            {
              theme: 'struggle and resilience',
              quotes: [
                'But the ghetto sun will nurture life and mend my soul sometime again',
                'One man struggles while another relaxes',
                'An acid drop of rain, recycled from the sea',
              ],
            },
            {
              theme: 'change and reflection',
              quotes: [
                "The wheel keeps turning, the sky's rearranging",
                'Look up at the blue skies beneath a new tree',
                "Sometime again, you'll turn green, and the sea turns red",
              ],
            },
            {
              theme: 'environment and society',
              quotes: [
                'And so the green come tumbling down',
                'On the surface of the wheel, they build another town',
                'While satellites and cameras watch from the skies',
              ],
            },
          ],
          description:
            "Extracts a list of the main themes covered by the song's lyrics, referring to the portion of the songs that better convey such messages.",
        },
        meaning: {
          explanation:
            "The song 'Hymn Of The Big Wheel' by Massive Attack feat. Horace Andy & Nellee Hooper reflects on the cyclical nature of life, where one person's struggles contrast with another's ease.",
          description:
            "Generates a simple, short explanation of the lyrics' content.",
        },
        moderation: {
          needs_moderation: false,
          categories: [
            {
              category: 'harassment',
              score: 0.00069648468203347,
              is_present: false,
            },
            {
              category: 'hate',
              score: 6.7719423303857e-5,
              is_present: false,
            },
            {
              category: 'violence',
              score: 0.016080376265353,
              is_present: false,
            },
          ],
          description:
            'Identifies a set of content categories that may require moderation.',
        },
        rating: {
          audience: 'PG',
          descriptor:
            'The lyrics contain some mature themes and imagery that may not be suitable for younger children.',
          description:
            "Assigns to the provided song's lyrics a parental guide rating, much like the ones from the Motion Picture Association film rating system.",
        },
        moods: {
          main_moods: [
            'reflection',
            'social commentary',
            'angst',
            'nostalgia',
            'hope',
          ],
          description:
            'Extracts a list of an arbitrary number of moods from the lyrics corpus to establish a form of lyrics classification through sentiment analysis.',
        },
        religion: {
          has_references: false,
          description:
            "Identifies references to religions, religious themes or religious groups within a song's lyrics.",
        },
      },
    },
  },
};

const validResponseWithEntities = {
  message: {
    header: {
      status_code: 200,
      execute_time: 0.016855001449585,
    },
    body: {
      analysis: {
        themes: {
          main_themes: [
            {
              theme: 'imagination and adventure',
              quotes: [
                'Lived a man who sailed to sea',
                'And we lived beneath the waves',
              ],
            },
          ],
          description:
            "Extracts a list of the main themes covered by the song's lyrics, referring to the portion of the songs that better convey such messages.",
        },
        entities: {
          entity_list: [
            {
              entity_name: 'Yellow Submarine',
              model_metadata: {
                type: 'Songs & Albums',
                description: 'A song by The Beatles.',
              },
              categories: ['Things', 'Cultural Works', 'Songs & Albums'],
              wikipedia: [
                {
                  language: 'en',
                  url: 'https://en.wikipedia.org/wiki/Yellow_Submarine_(song)',
                },
              ],
              wikidata: {
                description:
                  'original song written and composed by Lennon\u2013McCartney; first recorded by The Beatles',
                rank: 252460,
                types: ['musical work/composition'],
                id: 'Q832799',
              },
              matches: [
                {
                  start_char: 209,
                  end_char: 225,
                  matched_text: 'yellow submarine',
                },
                {
                  start_char: 244,
                  end_char: 260,
                  matched_text: 'yellow submarine',
                },
              ],
              occurrences: 25,
            },
          ],
          description:
            'Identifies and categorizes specific elements like names, locations, dates, organizations, and more.',
        },
        meaning: {
          explanation:
            "The song 'Yellow Submarine' by The Beatles paints a whimsical picture of a carefree life.",
          description:
            "Generates a simple, short explanation of the lyrics' content.",
        },
        moderation: {
          needs_moderation: false,
          categories: [
            {
              category: 'harassment',
              score: 6.0707558044151e-5,
              is_present: false,
            },
          ],
          description:
            'Identifies a set of content categories that may require moderation.',
        },
        moods: {
          main_moods: ['joy', 'adventure', 'celebration', 'freedom', 'peace'],
          description:
            'Extracts a list of an arbitrary number of moods from the lyrics corpus to establish a form of lyrics classification through sentiment analysis.',
        },
        rating: {
          audience: 'G',
          descriptor:
            'The lyrics contain no offensive language, mature themes, or depictions of violence.',
          description:
            "Assigns to the provided song's lyrics a parental guide rating, much like the ones from the Motion Picture Association film rating system.",
        },
        religion: {
          has_references: false,
          description:
            "Identifies references to religions, religious themes or religious groups within a song's lyrics.",
        },
      },
    },
  },
};

const validResponseWithLanguageDetection = {
  message: {
    header: {
      status_code: 200,
      execute_time: 0.012,
    },
    body: {
      analysis: {
        meaning: {
          explanation: 'A song about love.',
          description:
            "Generates a simple, short explanation of the lyrics' content.",
        },
        language_detection: {
          languages: [
            {
              language_iso_code_1: 'en',
              language_iso_code_3: 'eng',
              language_name: 'english',
              percentage: 100,
              is_romanized: false,
            },
          ],
        },
      },
    },
  },
};

const validResponseWithEmptyAnalysisFields = {
  message: {
    header: {
      status_code: 200,
      execute_time: 0.01,
    },
    body: {
      analysis: {
        meaning: {
          explanation: 'A simple song.',
          description:
            "Generates a simple, short explanation of the lyrics' content.",
        },
        entities: {},
        explicitness: {},
        language_detection: {},
      },
    },
  },
};

t.test('track.lyrics.analysis.get definition (spec)', (t) => {
  t.test('Should parse a valid response', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientTrackLyricsAnalysisGetResponseSchema,
    );

    const result = schema.safeParse(validResponse);

    t.ok(result.success, 'Should parse successfully');
    t.strictSame(result.data, validResponse, 'Should match the fixture');
    t.end();
  });

  t.test('Should parse a valid response with entities', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientTrackLyricsAnalysisGetResponseSchema,
    );

    const result = schema.safeParse(validResponseWithEntities);

    t.ok(result.success, 'Should parse successfully');
    t.strictSame(
      result.data,
      validResponseWithEntities,
      'Should match the fixture',
    );
    t.end();
  });

  t.test('Should parse a valid response with language detection', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientTrackLyricsAnalysisGetResponseSchema,
    );

    const result = schema.safeParse(validResponseWithLanguageDetection);

    t.ok(result.success, 'Should parse successfully');
    t.strictSame(
      result.data,
      validResponseWithLanguageDetection,
      'Should match the fixture',
    );
    t.end();
  });

  t.test('Should parse a valid response with empty analysis fields', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientTrackLyricsAnalysisGetResponseSchema,
    );

    const result = schema.safeParse(validResponseWithEmptyAnalysisFields);

    t.ok(result.success, 'Should parse successfully');
    t.strictSame(
      result.data,
      validResponseWithEmptyAnalysisFields,
      'Should match the fixture',
    );
    t.end();
  });

  t.test('Should reject a response with missing required field', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientTrackLyricsAnalysisGetResponseSchema,
    );

    const invalidResponse = structuredClone(validResponseWithEntities);
    // @ts-expect-error intentionally removing required field
    delete invalidResponse.message.body.analysis.entities.entity_list[0]
      .entity_name;

    const result = schema.safeParse(invalidResponse);

    t.notOk(result.success, 'Should fail parsing');
    t.end();
  });

  t.end();
});
