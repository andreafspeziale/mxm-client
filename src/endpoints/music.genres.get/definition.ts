import { z } from 'zod';
import { musicGenreSchema } from '../shared.js';

export const MUSIC_GENRES_GET_METHOD = 'GET' as const;
export const MUSIC_GENRES_GET_ENDPOINT = '/ws/1.1/music.genres.get';

export type MusicGenresGetQuery = Record<string, never>;

export const mxmClientMusicGenresGetResponseSchema = z.object({
  music_genre_list: z.array(
    z.object({
      music_genre: musicGenreSchema,
    }),
  ),
});

export type MxmClientMusicGenresGetResponse = z.infer<
  typeof mxmClientMusicGenresGetResponseSchema
>;
