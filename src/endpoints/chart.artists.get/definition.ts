import { z } from 'zod';
import { artistSchema } from '../shared.js';

export const CHART_ARTISTS_GET_METHOD = 'GET' as const;
export const CHART_ARTISTS_GET_ENDPOINT = '/ws/1.1/chart.artists.get';

export type ChartArtistsGetQuery = {
  // A valid two-letter country code (e.g. "US", "IT")
  country?: string;
  page?: string;
  page_size?: string;
};

export const mxmClientChartArtistsGetResponseSchema = z.object({
  artist_list: z.array(z.object({ artist: artistSchema })),
});

export type MxmClientChartArtistsGetResponse = z.infer<
  typeof mxmClientChartArtistsGetResponseSchema
>;
