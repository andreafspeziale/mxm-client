import { z } from 'zod';
import { trackSchema } from '../shared.js';

export const CHART_TRACKS_GET_METHOD = 'GET' as const;
export const CHART_TRACKS_GET_ENDPOINT = '/ws/1.1/chart.tracks.get';

export type ChartTracksGetQuery = {
  // A valid two-letter country code (e.g. "US", "IT") or "XW" for worldwide
  country?: string;
  // Available charts: "top", "hot", "mxmweekly", "mxmweekly_new"
  chart_name?: string;
  // When set to "1", only content containing lyrics is returned
  f_has_lyrics?: string;
  page?: string;
  page_size?: string;
};

export const mxmClientChartTracksGetResponseSchema = z.object({
  track_list: z.array(z.object({ track: trackSchema })),
});

export type MxmClientChartTracksGetResponse = z.infer<
  typeof mxmClientChartTracksGetResponseSchema
>;
