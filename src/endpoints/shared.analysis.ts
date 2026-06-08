import { z } from 'zod';

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

export const analysisLanguageDetectionSchema = z.union([
  z.object({
    languages: z.array(
      z.object({
        language_iso_code_1: z.string(),
        language_iso_code_3: z.string(),
        language_name: z.string(),
        percentage: z.number(),
        is_romanized: z.boolean(),
      }),
    ),
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
  language_detection: analysisLanguageDetectionSchema.optional(),
});
