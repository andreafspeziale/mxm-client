import { z } from 'zod';
import { trackSchema } from '../shared.js';

export const ALBUM_TRACKS_GET_METHOD = 'GET' as const;
export const ALBUM_TRACKS_GET_ENDPOINT = '/ws/1.1/album.tracks.get';

export type AlbumTracksGetQuery = {
  album_id: string;
  f_has_lyrics?: string;
  page?: string;
  page_size?: string;
};

export const mxmClientAlbumTracksGetResponseSchema = z.object({
  track_list: z.array(z.object({ track: trackSchema })),
});

export type MxmClientAlbumTracksGetResponse = z.infer<
  typeof mxmClientAlbumTracksGetResponseSchema
>;
