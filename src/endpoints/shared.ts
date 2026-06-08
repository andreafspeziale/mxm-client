import { z } from 'zod';

// --- Shared query types ---

export type TrackIdentifierQuery =
  | {
      commontrack_id: string;
      track_isrc?: never;
      track_spotify_id?: never;
      track_itunes_id?: never;
    }
  | {
      commontrack_id?: never;
      track_isrc: string;
      track_spotify_id?: never;
      track_itunes_id?: never;
    }
  | {
      commontrack_id?: never;
      track_isrc?: never;
      track_spotify_id: string;
      track_itunes_id?: never;
    }
  | {
      commontrack_id?: never;
      track_isrc?: never;
      track_spotify_id?: never;
      track_itunes_id: string;
    };

export type ExtendedTrackIdentifierQuery =
  | {
      commontrack_id: string;
      track_id?: never;
      track_isrc?: never;
      track_spotify_id?: never;
      track_itunes_id?: never;
    }
  | {
      commontrack_id?: never;
      track_id: string;
      track_isrc?: never;
      track_spotify_id?: never;
      track_itunes_id?: never;
    }
  | {
      commontrack_id?: never;
      track_id?: never;
      track_isrc: string;
      track_spotify_id?: never;
      track_itunes_id?: never;
    }
  | {
      commontrack_id?: never;
      track_id?: never;
      track_isrc?: never;
      track_spotify_id: string;
      track_itunes_id?: never;
    }
  | {
      commontrack_id?: never;
      track_id?: never;
      track_isrc?: never;
      track_spotify_id?: never;
      track_itunes_id: string;
    };

// --- Shared response schemas ---

export const musicGenreSchema = z.object({
  music_genre_id: z.number(),
  music_genre_parent_id: z.number(),
  music_genre_name: z.string(),
  music_genre_name_extended: z.string(),
  music_genre_vanity: z.string(),
});

export const albumSchema = z.object({
  album_id: z.number(),
  album_name: z.string(),
  album_release_date: z.string(),
  artist_id: z.number(),
  artist_name: z.string(),
  album_pline: z.string(),
  album_copyright: z.string(),
  album_label: z.string(),
  restricted: z.number(),
  updated_time: z.string(),
});

export const artistSchema = z.object({
  artist_id: z.number(),
  artist_name: z.string(),
  artist_name_translation_list: z.array(
    z.object({
      artist_name_translation: z.object({
        language: z.string(),
        translation: z.string(),
      }),
    }),
  ),
  artist_comment: z.string(),
  artist_country: z.string(),
  artist_alias_list: z.array(
    z.object({
      artist_alias: z.string(),
    }),
  ),
  artist_twitter_url: z.string(),
  artist_credits: z.object({
    artist_list: z.array(z.unknown()),
  }),
  restricted: z.number(),
  updated_time: z.string(),
  begin_date_year: z.string(),
  begin_date: z.string(),
  end_date_year: z.string(),
  end_date: z.string(),
});

export const trackSchema = z.object({
  track_id: z.number(),
  track_isrc: z.string(),
  commontrack_isrcs: z.array(z.array(z.string())),
  track_spotify_id: z.string(),
  track_name: z.string(),
  track_rating: z.number(),
  track_length: z.number(),
  commontrack_id: z.number(),
  instrumental: z.number(),
  explicit: z.number(),
  has_lyrics: z.number(),
  track_lyrics_translation_status: z
    .array(
      z.object({
        from: z.string(),
        perc: z.number(),
        to: z.string(),
      }),
    )
    .optional(), // TODO: this is expected from the docs but is not present in the actual response
  has_subtitles: z.number(),
  has_richsync: z.number(),
  num_favourite: z.number(),
  album_id: z.number(),
  album_name: z.string(),
  artist_id: z.number(),
  artist_name: z.string(),
  // TODO: the following are not present in the docs but actually are in the response
  album_coverart_100x100: z.string(),
  album_coverart_350x350: z.string(),
  album_coverart_500x500: z.string(),
  album_coverart_800x800: z.string(),
  //
  track_share_url: z.string(),
  track_edit_url: z.string(),
  restricted: z.number(),
  updated_time: z.string(),
  primary_genres: z.object({
    music_genre_list: z.array(
      z.object({
        music_genre: musicGenreSchema,
      }),
    ),
  }),
  // TODO: not returned by track.search
  track_lyrics_translation_options: z
    .object({
      contribution_blocked: z.number(),
    })
    .optional(),
});

// --- Analysis response schemas ---

export const analysisMeaningSchema = z.union([
  z.object({
    explanation: z.string(),
    description: z.string(),
  }),
  z.object({}).strict(),
]);

export const analysisThemesSchema = z.union([
  z.object({
    main_themes: z.array(
      z.object({
        theme: z.string(),
        quotes: z.array(z.string()),
      }),
    ),
    description: z.string(),
  }),
  z.object({}).strict(),
]);

export const analysisMoodsSchema = z.union([
  z.object({
    main_moods: z.array(z.string()),
    description: z.string(),
  }),
  z.object({}).strict(),
]);

export const analysisRatingSchema = z.union([
  z.object({
    audience: z.string(),
    descriptor: z.string(),
    description: z.string(),
  }),
  z.object({}).strict(),
]);

export const analysisReligionSchema = z.union([
  z.object({
    has_references: z.boolean(),
    referenced_religions: z.array(z.string()).optional(),
    description: z.string(),
  }),
  z.object({}).strict(),
]);

export const analysisEntityMatchSchema = z.object({
  start_char: z.number(),
  end_char: z.number(),
  matched_text: z.string(),
});

export const analysisEntityWikidataSchema = z.object({
  id: z.string(),
  description: z.string().optional(),
  rank: z.number().optional(),
  types: z.array(z.string()).optional(),
  thumbnail: z.string().optional(),
});

export const analysisEntitySchema = z.object({
  entity_name: z.string(),
  categories: z.array(z.string()),
  occurrences: z.number(),
  model_metadata: z
    .object({
      type: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
  matches: z.array(analysisEntityMatchSchema).optional(),
  wikipedia: z
    .array(
      z.object({
        language: z.string(),
        url: z.string(),
      }),
    )
    .optional(),
  wikidata: analysisEntityWikidataSchema.optional(),
});

export const analysisEntitiesSchema = z.union([
  z.object({
    entity_list: z.array(analysisEntitySchema),
    description: z.string(),
  }),
  z.object({}).strict(),
]);

export const analysisModerationCategorySchema = z.object({
  category: z.string(),
  score: z.number(),
  is_present: z.boolean(),
});

export const analysisModerationSchema = z.union([
  z.object({
    needs_moderation: z.boolean(),
    categories: z.array(analysisModerationCategorySchema),
    description: z.string(),
  }),
  z.object({}).strict(),
]);

export const analysisExplicitExpressionSchema = z.object({
  severity: z.string(),
  start_char: z.number(),
  end_char: z.number(),
  reason: z.string(),
  text: z.string(),
  profanities: z
    .array(
      z.object({
        start_char: z.number(),
        end_char: z.number(),
        lemma: z.string(),
        profanity: z.string(),
      }),
    )
    .optional(),
});

export const analysisExplicitnessSchema = z.union([
  z.object({
    explicit_expressions: z.array(analysisExplicitExpressionSchema),
    description: z.string(),
  }),
  z.object({}).strict(),
]);

export const analysisSchema = z.object({
  meaning: analysisMeaningSchema.optional(),
  themes: analysisThemesSchema.optional(),
  moods: analysisMoodsSchema.optional(),
  rating: analysisRatingSchema.optional(),
  religion: analysisReligionSchema.optional(),
  entities: analysisEntitiesSchema.optional(),
  moderation: analysisModerationSchema.optional(),
  explicitness: analysisExplicitnessSchema.optional(),
});

export const lyricsSchema = z.object({
  explicit: z.number(),
  lyrics_body: z.string(),
  lyrics_copyright: z.string(),
  lyrics_id: z.number(),
  lyrics_language: z.string(),
  pixel_tracking_url: z.string(),
  region_restriction: z
    .object({
      allowed: z.array(z.string()),
      blocked: z.array(z.string()),
    })
    .optional(), // TODO: this is expected from the docs but is not present in the actual response
  script_tracking_url: z.string(),
  updated_time: z.string(),
});

export const subtitleSchema = z.object({
  subtitle_id: z.number(),
  subtitle_body: z.string(),
  lyrics_copyright: z.string(),
  region_restriction: z
    .object({
      allowed: z.array(z.string()),
      blocked: z.array(z.string()),
    })
    .optional(), // TODO: this is expected from the docs but is not present in the actual response
  subtitle_length: z.number(),
  subtitle_language: z.string(),
  subtitle_language_description: z.string(),
  script_tracking_url: z.string(),
  pixel_tracking_url: z.string(),
  updated_time: z.string(),
});
