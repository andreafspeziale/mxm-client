import t from 'tap';
import { buildLegacyAPIResponseSchema } from '../../mxm-client.schemas.js';
import { mxmClientTrackLyricsAnalysisSearchResponseSchema } from './definition.js';

const validResponse = {
  message: {
    header: {
      status_code: 200,
      execute_time: 0.428,
    },
    body: {
      track_list: [
        {
          track: {
            track_id: 215977297,
            track_isrc: 'USHM92550390',
            commontrack_isrcs: [['USHM92550390']],
            track_spotify_id: '2liYrCQZzTpvYTngb8EJaF',
            track_name: 'Heartbreak Songs',
            track_rating: 3,
            track_length: 0,
            commontrack_id: 215977297,
            instrumental: 0,
            explicit: 1,
            has_lyrics: 1,
            has_subtitles: 0,
            has_richsync: 0,
            num_favourite: 0,
            album_id: 81461300,
            album_name: 'Heartbreak Songs',
            artist_id: 56497597,
            artist_name: 'Craig Harris',
            album_coverart_100x100:
              'http://s.mxmcdn.net/images-storage/albums/nocover.png',
            album_coverart_350x350: '',
            album_coverart_500x500: '',
            album_coverart_800x800: '',
            track_share_url: 'https://www.musixmatch.com/lyrics/...',
            track_edit_url: 'https://www.musixmatch.com/lyrics/...',
            restricted: 0,
            updated_time: '2025-07-29T15:08:33Z',
            primary_genres: {
              music_genre_list: [
                {
                  music_genre: {
                    music_genre_id: 6,
                    music_genre_parent_id: 34,
                    music_genre_name: 'Country',
                    music_genre_name_extended: 'Country',
                    music_genre_vanity: 'Country',
                  },
                },
              ],
            },
          },
          analysis: {
            themes: {
              main_themes: [
                {
                  theme: 'love and appreciation',
                  quotes: [
                    "The truth is that girl, you're too good for me",
                    'Girl, you make it too damn hard',
                  ],
                },
              ],
              description:
                "Extracts a list of the main themes covered by the song's lyrics, referring to the portion of the songs that better convey such messages.",
            },
            meaning: {
              explanation:
                "The song 'Heartbreak Songs' by Craig Harris expresses how meeting someone special can change one's perspective on love.",
              description:
                "Generates a simple, short explanation of the lyrics' content.",
            },
            moderation: {
              needs_moderation: false,
              categories: [
                {
                  category: 'harassment',
                  score: 0.020195492662961,
                  is_present: false,
                },
                {
                  category: 'violence',
                  score: 0.021706620947801,
                  is_present: false,
                },
              ],
              description:
                'Identifies a set of content categories that may require moderation.',
            },
            moods: {
              main_moods: ['love', 'joy', 'heartbreak', 'hope', 'reflection'],
              description:
                'Extracts a list of an arbitrary number of moods from the lyrics corpus to establish a form of lyrics classification through sentiment analysis.',
            },
            rating: {
              audience: 'G',
              descriptor:
                'The lyrics focus on themes of love and relationships without any explicit language, violence, or adult content.',
              description:
                "Assigns to the provided song's lyrics a parental guide rating, much like the ones from the Motion Picture Association film rating system.",
            },
            explicitness: {
              explicit_expressions: [
                {
                  severity: 'mild',
                  start_char: 329,
                  end_char: 333,
                  reason: 'mild profanity',
                  text: 'damn',
                },
              ],
              description:
                'Examines a text to find offensive or inappropriate words and phrases.',
            },
            religion: {
              has_references: false,
              description:
                "Identifies references to religions, religious themes or religious groups within a song's lyrics.",
            },
          },
        },
      ],
    },
  },
};

const validResponseWithEntities = {
  message: {
    header: {
      status_code: 200,
      execute_time: 0.18,
    },
    body: {
      track_list: [
        {
          track: {
            track_id: 226743256,
            track_isrc: 'QT6E72527834',
            commontrack_isrcs: [['QT6E72527834']],
            track_spotify_id: '1jtOPDDWSSOBJfGkDzPput',
            track_name: 'paris sans ciel',
            track_rating: 4,
            track_length: 0,
            commontrack_id: 226743256,
            instrumental: 0,
            explicit: 1,
            has_lyrics: 1,
            has_subtitles: 1,
            has_richsync: 0,
            num_favourite: 0,
            album_id: 86346568,
            album_name: 'Science Auditive vol.2 - EP',
            artist_id: 55219020,
            artist_name: '147Goya',
            album_coverart_100x100:
              'http://s.mxmcdn.net/images-storage/albums/nocover.png',
            album_coverart_350x350: '',
            album_coverart_500x500: '',
            album_coverart_800x800: '',
            track_share_url: 'https://www.musixmatch.com/lyrics/...',
            track_edit_url: 'https://www.musixmatch.com/lyrics/...',
            restricted: 0,
            updated_time: '2025-11-12T17:44:51Z',
            primary_genres: {
              music_genre_list: [
                {
                  music_genre: {
                    music_genre_id: 18,
                    music_genre_parent_id: 34,
                    music_genre_name: 'Hip Hop/Rap',
                    music_genre_name_extended: 'Hip-Hop/Rap',
                    music_genre_vanity: 'Hip-Hop-Rap',
                  },
                },
              ],
            },
          },
          analysis: {
            entities: {
              entity_list: [
                {
                  entity_name: 'Paris',
                  model_metadata: {
                    description: 'The capital city of France',
                  },
                  categories: [
                    'Things',
                    'Geographical Locations',
                    'Urban & Political Locations',
                    'Cities & Towns',
                  ],
                  wikipedia: [
                    {
                      language: 'en',
                      url: 'https://en.wikipedia.org/wiki/Paris',
                    },
                  ],
                  wikidata: {
                    description: 'capital city and largest city of France',
                    rank: 524521,
                    types: ['department of France', 'megacity'],
                    thumbnail:
                      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/La_Tour_Eiffel.jpg/50px-La_Tour_Eiffel.jpg',
                    id: 'Q90',
                  },
                  matches: [
                    {
                      start_char: 31,
                      end_char: 36,
                      matched_text: 'Paris',
                    },
                  ],
                  occurrences: 12,
                },
              ],
              description:
                'Identifies and categorizes specific elements like names, locations, dates, organizations, and more.',
            },
            meaning: {
              explanation:
                "The song 'paris sans ciel' describes a romantic encounter in Paris.",
              description:
                "Generates a simple, short explanation of the lyrics' content.",
            },
            themes: {
              main_themes: [
                {
                  theme: 'freedom and exploration',
                  quotes: ['Paris sans ciel'],
                },
              ],
              description:
                "Extracts a list of the main themes covered by the song's lyrics, referring to the portion of the songs that better convey such messages.",
            },
            moderation: {
              needs_moderation: false,
              categories: [
                {
                  category: 'harassment',
                  score: 0.040199359687483,
                  is_present: false,
                },
              ],
              description:
                'Identifies a set of content categories that may require moderation.',
            },
            moods: {
              main_moods: ['love', 'joy', 'adventure'],
              description:
                'Extracts a list of an arbitrary number of moods from the lyrics corpus to establish a form of lyrics classification through sentiment analysis.',
            },
            rating: {
              audience: 'PG-13',
              descriptor:
                'The lyrics contain mature themes and suggestive content.',
              description:
                "Assigns to the provided song's lyrics a parental guide rating, much like the ones from the Motion Picture Association film rating system.",
            },
            explicitness: {
              explicit_expressions: [
                {
                  severity: 'moderate',
                  start_char: 430,
                  end_char: 494,
                  reason: 'reference to sexual activity in a derogatory manner',
                  text: "C'qu'on a fait au lit est tellement sale",
                },
                {
                  severity: 'moderate',
                  start_char: 813,
                  end_char: 865,
                  reason: 'vulgar imagery related to sexual activity',
                  text: 'Le matelas est foutu il ressemble juste à une éponge',
                  profanities: [
                    {
                      start_char: 828,
                      end_char: 833,
                      lemma: 'foutre',
                      profanity: 'foutu',
                    },
                  ],
                },
              ],
              description:
                'Examines a text to find offensive or inappropriate words and phrases.',
            },
            religion: {
              has_references: false,
              description:
                "Identifies references to religions, religious themes or religious groups within a song's lyrics.",
            },
          },
        },
      ],
    },
  },
};

const validResponseWithEmptyAnalysisFields = {
  message: {
    header: {
      status_code: 200,
      execute_time: 0.12,
    },
    body: {
      track_list: [
        {
          track: {
            track_id: 123456,
            track_isrc: 'ISRC123',
            commontrack_isrcs: [['ISRC123']],
            track_spotify_id: 'SPOTIFY123',
            track_name: 'Test Song',
            track_rating: 1,
            track_length: 180,
            commontrack_id: 123456,
            instrumental: 0,
            explicit: 0,
            has_lyrics: 1,
            has_subtitles: 0,
            has_richsync: 0,
            num_favourite: 0,
            album_id: 1,
            album_name: 'Test Album',
            artist_id: 1,
            artist_name: 'Test Artist',
            album_coverart_100x100:
              'http://s.mxmcdn.net/images-storage/albums/nocover.png',
            album_coverart_350x350: '',
            album_coverart_500x500: '',
            album_coverart_800x800: '',
            track_share_url: 'https://www.musixmatch.com/lyrics/...',
            track_edit_url: 'https://www.musixmatch.com/lyrics/...',
            restricted: 0,
            updated_time: '2025-01-01T00:00:00Z',
            primary_genres: {
              music_genre_list: [],
            },
          },
          analysis: {
            meaning: {
              explanation: 'A children song.',
              description:
                "Generates a simple, short explanation of the lyrics' content.",
            },
            themes: {
              main_themes: [
                {
                  theme: 'playfulness',
                  quotes: ['La la la'],
                },
              ],
              description:
                "Extracts a list of the main themes covered by the song's lyrics, referring to the portion of the songs that better convey such messages.",
            },
            moods: {
              main_moods: ['joy'],
              description:
                'Extracts a list of an arbitrary number of moods from the lyrics corpus to establish a form of lyrics classification through sentiment analysis.',
            },
            rating: {
              audience: 'G',
              descriptor: 'Suitable for all ages.',
              description:
                "Assigns to the provided song's lyrics a parental guide rating, much like the ones from the Motion Picture Association film rating system.",
            },
            entities: {},
            explicitness: {},
            religion: {
              has_references: false,
              description:
                "Identifies references to religions, religious themes or religious groups within a song's lyrics.",
            },
            moderation: {
              needs_moderation: false,
              categories: [
                {
                  category: 'harassment',
                  score: 0.001,
                  is_present: false,
                },
              ],
              description:
                'Identifies a set of content categories that may require moderation.',
            },
          },
        },
      ],
    },
  },
};

t.test('track.lyrics.analysis.search definition (spec)', (t) => {
  t.test('Should parse a valid response with full analysis', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientTrackLyricsAnalysisSearchResponseSchema,
    );

    const result = schema.safeParse(validResponse);

    t.ok(result.success, 'Should parse successfully');
    t.strictSame(result.data, validResponse, 'Should match the fixture');
    t.end();
  });

  t.test('Should parse a valid response with entities', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientTrackLyricsAnalysisSearchResponseSchema,
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

  t.test('Should parse a valid response with empty analysis fields', (t) => {
    const schema = buildLegacyAPIResponseSchema(
      mxmClientTrackLyricsAnalysisSearchResponseSchema,
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
      mxmClientTrackLyricsAnalysisSearchResponseSchema,
    );

    const invalidResponse = structuredClone(validResponse);
    // @ts-expect-error intentionally removing required field
    delete invalidResponse.message.body.track_list[0].track.track_id;

    const result = schema.safeParse(invalidResponse);

    t.notOk(result.success, 'Should fail parsing');
    t.end();
  });

  t.end();
});
