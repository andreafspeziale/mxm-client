import { z } from 'zod';

export const LANGUAGES_GET_METHOD = 'GET' as const;
export const LANGUAGES_GET_ENDPOINT = '/ws/1.1/languages.get';

export type LanguagesGetQuery = {
  get_romanized_info?: '1';
};

const languageSchema = z.object({
  language_iso_code_1: z.string(),
  language_iso_code_3: z.string(),
  language_name: z.string(),
  has_romanization: z.number().optional(),
  is_romanized: z.number().optional(),
  iso_code_romanization: z.string().optional(),
});

export const mxmClientLanguagesGetResponseSchema = z.object({
  language_list: z.array(
    z.object({
      language: languageSchema,
    }),
  ),
});

export type MxmClientLanguagesGetResponse = z.infer<
  typeof mxmClientLanguagesGetResponseSchema
>;
