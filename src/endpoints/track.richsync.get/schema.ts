import { z } from 'zod';

export const mxmClientTrackRichSyncGetResponseSchema = z.object({
  richsync: z.object({
    richsync_id: z.number(),
    restricted: z.number(),
    richsync_body: z.string(),
    lyrics_copyright: z.string(),
    richsync_length: z.number(),
    richssync_language: z.string(),
    richsync_language_description: z.string(),
    richsync_avg_count: z.number(),
    script_tracking_url: z.string(),
    pixel_tracking_url: z.string(),
    html_tracking_url: z.string(),
    writer_list: z.array(z.unknown()),
    publisher_list: z.array(z.unknown()),
    updated_time: z.string(),
  }),
});
