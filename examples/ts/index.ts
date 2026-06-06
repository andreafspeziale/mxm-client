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

  // This call basically enrich not only the query but also the actual response, but the prop that will be added to the response
  // will not be accessible. No error will throw, but the prop will be stripped out from the response

  interface MyFingerprintQuery extends TrackLyricsFingerprintPostQuery {
    include_ngram_length: boolean;
  }

  const b = await client
    .trackLyricsFingerprintPost<MyFingerprintQuery>({
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

  // Same as above but with also body enrichment

  interface MyFingerprintBody extends TrackLyricsFingerprintPostBody {
    settings: { algorithm: string };
  }

  const c = await client
    .trackLyricsFingerprintPost<MyFingerprintQuery, MyFingerprintBody>({
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

  // To extend the response in safeland, build your own body schema and pass it via `options.responseSchema`.
  // When using explicit generics for query/body extension, you must also pass `typeof yourSchema` as the last generic.
  // TypeScript cannot partially infer generics — if you specify any, you must specify all.
  const baseTrackListItemSchema =
    mxmClientTrackLyricsFingerprintPostResponseSchema.shape.track_list.element;
  const enrichedBodySchema = z.object({
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
      MyFingerprintQuery,
      MyFingerprintBody,
      typeof enrichedBodySchema
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
        responseSchema: enrichedBodySchema,
      },
    })
    .catch((_) => {
      process.exit(1);
    });

  console.log(
    d.message.body.track_list[0].matching.longest_common_ngram_length,
  ); // Should not highlight any error and should be accessible

  // The difference in unsafeland is that the consumer can pass the third generic type to extend the response.
  // The option responseSchema should not be expected or even suggested by the IDE
  // I don't want the consumer to be able to pass the response generic here, I want it to be infered from the passed schema and I expect
  // to be able to accesso `longest_common_ngram_length` in the reponse
  interface MyFingerprintResponse {
    track_list: Array<
      MxmClientTrackLyricsFingerprintPostResponse['track_list'][number] & {
        matching: { longest_common_ngram_length: number };
      }
    >;
  }

  const e = await client.unsafe
    .trackLyricsFingerprintPost<
      MyFingerprintQuery,
      MyFingerprintBody,
      MyFingerprintResponse
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
