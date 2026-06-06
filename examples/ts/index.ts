import {
  MxmClient,
  type MxmClientTrackLyricsFingerprintPostResponse,
  mxmClientTrackLyricsFingerprintPostResponseSchema,
  type TrackLyricsFingerprintPostBody,
  type TrackLyricsFingerprintPostQuery,
} from '@andreafspeziale/mxm-client';
import { z } from 'zod';

const MXM_API_KEY = process.env.MXM_API_KEY;

const client = new MxmClient({
  config: {
    enableLog: true,
    apiKey: MXM_API_KEY,
    defaultLoggerConfig: { level: 'debug' },
  },
});

(async () => {
  // Basic call with default query and body types
  const a = await client
    .trackLyricsFingerprintPost({
      query: {
        size: 10,
        limit: 3,
      },
      body: {
        text: 'Thunder, thunder, thun-Thunder, th-th-thunder',
      },
    })
    .catch((_) => {
      process.exit(1);
    });

  // Extending query parameters via generics.
  // Extra fields are type-checked but the response type remains unchanged.

  interface MyFingerprintPostQuery extends TrackLyricsFingerprintPostQuery {
    include_ngram_length: boolean;
  }

  const b = await client
    .trackLyricsFingerprintPost<MyFingerprintPostQuery>({
      query: {
        size: 10,
        limit: 3,
        include_ngram_length: true,
      },
      body: {
        text: 'Thunder, thunder, thun-Thunder, th-th-thunder',
      },
    })
    .catch((_) => {
      process.exit(1);
    });

  // Extending both query and body types via generics

  interface MyFingerprintPostBody extends TrackLyricsFingerprintPostBody {
    settings: { algorithm: string };
  }

  const c = await client
    .trackLyricsFingerprintPost<MyFingerprintPostQuery, MyFingerprintPostBody>({
      query: {
        size: 10,
        limit: 3,
        include_ngram_length: true,
      },
      body: {
        text: 'Thunder, thunder, thun-Thunder, th-th-thunder',
        settings: { algorithm: 'raw' },
      },
    })
    .catch((_) => {
      process.exit(1);
    });

  // Extending the response with runtime validation via a custom body schema.
  // Pass `typeof yourSchema` as the last generic to enable type inference.
  // TypeScript cannot partially infer generics — if you specify any, you must specify all.
  const baseTrackListItemSchema =
    mxmClientTrackLyricsFingerprintPostResponseSchema.shape.track_list.element;
  const enrichedResponseSchema = z.object({
    track_list: z.array(
      baseTrackListItemSchema.extend({
        matching: z.object({
          longest_common_ngram_length: z.number(),
        }),
      }),
    ),
  });

  const d = await client
    .trackLyricsFingerprintPost<
      MyFingerprintPostQuery,
      MyFingerprintPostBody,
      typeof enrichedResponseSchema
    >({
      query: {
        size: 10,
        limit: 3,
        include_ngram_length: true,
      },
      body: {
        text: 'Thunder, thunder, thun-Thunder, th-th-thunder',
        settings: { algorithm: 'raw' },
      },
      options: {
        responseSchema: enrichedResponseSchema,
      },
    })
    .catch((_) => {
      process.exit(1);
    });

  console.log(
    d.message.body.track_list[0].matching.longest_common_ngram_length,
  );

  // Unsafe mode: extend the response type via a third generic without runtime validation.
  // The `responseSchema` option is not available in unsafe mode.

  interface MyFingerprintPostResponse {
    track_list: Array<
      MxmClientTrackLyricsFingerprintPostResponse['track_list'][number] & {
        matching: { longest_common_ngram_length: number };
      }
    >;
  }

  const e = await client.unsafe
    .trackLyricsFingerprintPost<
      MyFingerprintPostQuery,
      MyFingerprintPostBody,
      MyFingerprintPostResponse
    >({
      query: {
        size: 10,
        limit: 3,
        include_ngram_length: true,
      },
      body: {
        text: 'Thunder, thunder, thun-Thunder, th-th-thunder',
        settings: { algorithm: 'raw' },
      },
    })
    .catch((_) => {
      process.exit(1);
    });

  console.log(
    e.message.body.track_list[0].matching.longest_common_ngram_length,
  );
})();
