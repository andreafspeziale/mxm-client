<div align="center">
  <p>
    <img src="./assets/package-logo.png" height=304 alt="Logo" />
  </p>
  <p>
    HTTP client SDK showcase using <a href="https://github.com/nodejs/undici" target="blank">Undici</a>,<br>
    <a href="https://github.com/colinhacks/zod" target="blank">Zod</a> and <a href="https://github.com/pinojs/pino" target="blank">Pino</a> logger.
  </p>
  <p>
      <a href="https://www.npmjs.com/package/@andreafspeziale/mxm-client" target="_blank"><img src="https://img.shields.io/npm/v/@andreafspeziale/mxm-client.svg" alt="NPM Version" /></a>
      <a href="https://www.npmjs.com/package/@andreafspeziale/mxm-client" target="_blank"><img src="https://img.shields.io/npm/l/@andreafspeziale/mxm-client.svg" alt="Package License" /></a>
      <a href="https://github.com/andreafspeziale/mxm-client/actions" target="_blank"><img src="https://img.shields.io/github/actions/workflow/status/andreafspeziale/mxm-client/test.yml?label=test" alt="Test Status"/></a>
  </p>
</div>

> [!IMPORTANT]
> Artwork inspired by [ElysiaJS](https://elysiajs.com/).

## Installation

### npm

```sh
npm install @andreafspeziale/mxm-client
```

### yarn

```sh
yarn add @andreafspeziale/mxm-client
```

### pnpm

```sh
pnpm add @andreafspeziale/mxm-client
```

## How to use?

> [!NOTE]
> To effectively interact with the Musixmatch API you need a valid API key.

The SDK implements most of the [Musixmatch API endpoints](https://docs.musixmatch.com/lyrics-api/introduction), providing a strongly typed and easy-to-use interface for developers. It handles authentication, request construction and response parsing allowing you to focus on building your application.

### Zero-config

```ts
import { MxmClient } from '@andreafspeziale/mxm-client';

const mxmClient = new MxmClient();

const track = await mxmClient.trackGet({
  query: { track_isrc: 'USUM72005901', apiKey: 'your-api-key' },
});
```

### With API key configuration

```ts
import { MxmClient } from '@andreafspeziale/mxm-client';

const mxmClient = new MxmClient({
  config: {
    apiKey: 'your-api-key',
  },
});

const track = await mxmClient.trackGet({
  query: { track_isrc: 'USUM72005901' },
});
```

### With API key & Logging configuration
> A Pino basic logger instance is created internally when `enableLog` is set to `true`.

```ts
import { MxmClient } from '@andreafspeziale/mxm-client';

const mxmClient = new MxmClient({
  config: {
    apiKey: 'your-api-key',
    enableLog: true,
    defaultLoggerConfig: {
      formatters: {
        level: (label) => {
          return { level: label };
        },
      },
    },
  },
});

const track = await mxmClient.trackGet({
  query: { track_isrc: 'USUM72005901' },
});
```

### With API key & Pino instance plus Logging configuration
> A Pino logger instance is provided and logging can be enabled/disabled via configuration.

```ts
import { pino } from 'pino';
import { MxmClient } from '@andreafspeziale/mxm-client';

const logger = pino({
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
});

const mxmClient = new MxmClient({
  logger,
  config: {
    apiKey: 'your-api-key',
    enableLog: true,
  },
});

const track = await mxmClient.trackGet({
  query: { track_isrc: 'USUM72005901' },
});
```

### With custom base URL

> By default the client targets `https://api.musixmatch.com`. Use `baseUrl` to point the client at a different host (e.g. staging environment or a custom Kubernetes entrypoint).

```ts
import { MxmClient } from '@andreafspeziale/mxm-client';

const mxmClient = new MxmClient({
  config: {
    apiKey: 'your-api-key',
    baseUrl: 'https://staging.musixmatch.com',
  },
});

const track = await mxmClient.trackGet({
  query: { track_isrc: 'USUM72005901' },
});
```

### With status code validation disabled

> When `disableStatusCodeValidation` is set to `true`, the client will not throw on unexpected HTTP status codes allowing the response body validation to still run. Musixmatch APIs always return a `200` status code. In case of an error, it will still be `200` and the error details will be included in the response body. This option can be useful if for any odd reason the status code is not `200`.

#### Via client configuration (global)

```ts
import { MxmClient } from '@andreafspeziale/mxm-client';

const mxmClient = new MxmClient({
  config: {
    apiKey: 'your-api-key',
    disableStatusCodeValidation: true,
  },
});

const track = await mxmClient.trackGet({
  query: { track_isrc: 'USUM72005901' },
});
```

#### Via per-request options (override)

```ts
import { MxmClient } from '@andreafspeziale/mxm-client';

const mxmClient = new MxmClient({
  config: { apiKey: 'your-api-key' },
});

const track = await mxmClient.trackGet({
  query: { track_isrc: 'USUM72005901' },
  options: { disableStatusCodeValidation: true },
});
```

### Generic enrichment

The SDK supports extending input types via generics for advanced use cases where the API accepts fields beyond the documented ones.

#### Enriching query parameters

```ts
import { MxmClient, type TrackGetQuery } from '@andreafspeziale/mxm-client';

interface MyTrackGetQuery extends TrackGetQuery {
  custom_param: string;
}

const mxmClient = new MxmClient({
  config: { apiKey: 'your-api-key' },
});

const track = await mxmClient.trackGet<MyTrackGetQuery>({
  query: {
    track_isrc: 'USUM72005901',
    custom_param: 'value',
  },
});
```

#### Enriching request body (POST endpoints)

```ts
import {
  MxmClient,
  type TrackLyricsFingerprintPostQuery,
  type TrackLyricsFingerprintPostBody,
} from '@andreafspeziale/mxm-client';

interface MyFingerprintPostBody extends TrackLyricsFingerprintPostBody {
  settings: { algorithm: string };
}

const mxmClient = new MxmClient({
  config: { apiKey: 'your-api-key' },
});

const result = await mxmClient.trackLyricsFingerprintPost<
  TrackLyricsFingerprintPostQuery,
  MyFingerprintPostBody
>({
  body: {
    text: "Fratelli d'Italia...",
    settings: { algorithm: 'raw' },
  },
});
```

### Custom response schema

For full runtime safety with extended response types, you can provide a custom schema via `options.responseSchema`. The schema describes **only the response body** — the client handles the legacy response wrapper (`message.header` + `message.body`) internally. The return type is automatically inferred from your schema.

> [!NOTE]
> The `responseSchema` option accepts any schema implementing the [Standard Schema](https://standardschema.dev) interface (Zod, Valibot, ArkType, etc.).

> [!IMPORTANT]
> TypeScript does not support partial generic inference. If you need to specify generics for query or body extension, you must also pass `typeof yourSchema` as the last generic parameter.

```ts
import { z } from 'zod';
import {
  MxmClient,
  type TrackGetQuery,
  mxmClientTrackGetResponseSchema,
} from '@andreafspeziale/mxm-client';

// Extend the base body schema with custom fields
const myTrackGetResponseSchema = mxmClientTrackGetResponseSchema.extend({
  my_custom_field: z.string(),
});

interface MyTrackGetQuery extends TrackGetQuery {
  custom_param: string;
}

const mxmClient = new MxmClient({
  config: { apiKey: 'your-api-key' },
});

// Pass typeof schema as the last generic when extending query/body types
const track = await mxmClient.trackGet<MyTrackGetQuery, typeof myTrackGetResponseSchema>({
  query: { track_isrc: 'USUM72005901', custom_param: 'value' },
  options: { responseSchema: myTrackGetResponseSchema },
});

track.message.body.my_custom_field; // typed AND validated at runtime
track.message.body.track.track_name; // base fields are still accessible
```

### Unsafe mode

The SDK provides an `.unsafe` accessor that skips response body validation, allowing you to extend output types via generics for cases where the API returns fields not covered by the built-in schemas.

> [!CAUTION]
> In unsafe mode, the TypeScript type is not guaranteed at runtime. Use this when you know the API returns additional fields for your account or use case.

#### Extending response types

```ts
import {
  MxmClient,
  type TrackGetQuery,
  type MxmClientTrackGetResponse,
} from '@andreafspeziale/mxm-client';

interface MyTrackGetResponse extends MxmClientTrackGetResponse {
  my_custom_field: string;
}

const mxmClient = new MxmClient({
  config: { apiKey: 'your-api-key' },
});

const track = await mxmClient.unsafe.trackGet<TrackGetQuery, MyTrackGetResponse>({
  query: { track_isrc: 'USUM72005901' },
});

track.message.body.my_custom_field; // typed, not validated at runtime
track.message.body.track_name;      // inherited from base type
```

#### Extending both input and output

```ts
import {
  MxmClient,
  type TrackGetQuery,
  type MxmClientTrackGetResponse,
} from '@andreafspeziale/mxm-client';

interface MyTrackGetQuery extends TrackGetQuery {
  custom_param: string;
}

interface MyTrackGetResponse extends MxmClientTrackGetResponse {
  custom_output: number;
}

const mxmClient = new MxmClient({
  config: { apiKey: 'your-api-key' },
});

const track = await mxmClient.unsafe.trackGet<MyTrackGetQuery, MyTrackGetResponse>({
  query: {
    track_isrc: 'USUM72005901',
    custom_param: 'value',
  },
});
```

## Available methods

<!-- Matcher -->
- `matcherLyricsGet` ([matcher.lyrics.get](https://docs.musixmatch.com/lyrics-api/matcher/matcher-lyrics-get))
- `matcherSubtitleGet` ([matcher.subtitle.get](https://docs.musixmatch.com/lyrics-api/matcher/matcher-subtitle-get))
- `matcherTrackGet` ([matcher.track.get](https://docs.musixmatch.com/lyrics-api/matcher/matcher-track-get))

<!-- Track -->
- `trackGet` ([track.get](https://docs.musixmatch.com/lyrics-api/track/track-get))
- `trackSearch` ([track.search](https://docs.musixmatch.com/lyrics-api/track/track-search))
- `trackLyricsGet` ([track.lyrics.get](https://docs.musixmatch.com/lyrics-api/track/track-lyrics-get))
- `trackSubtitleGet` ([track.subtitle.get](https://docs.musixmatch.com/lyrics-api/track/track-subtitle-get))
- `trackRichSyncGet` ([track.richsync.get](https://docs.musixmatch.com/lyrics-api/track/track-richsync-get))
- `trackSnippetGet` ([track.snippet.get](https://docs.musixmatch.com/lyrics-api/track/track-snippet-get))

<!-- Translations -->
- `trackLyricsTranslationGet` ([track.lyrics.translation.get](https://docs.musixmatch.com/api-reference/lyrics-catalog/track-lyrics-translation-get))
- `trackSubtitleTranslationGet` ([track.subtitle.translation.get](https://docs.musixmatch.com/api-reference/lyrics-catalog/track-subtitle-translation-get))
- `languagesGet` ([languages.get](https://docs.musixmatch.com/api-reference/lyrics-catalog/languages-get))

<!-- Artist -->
- `artistGet` ([artist.get](https://docs.musixmatch.com/api-reference/lyrics-catalog/artist-get))
- `artistSearch` ([artist.search](https://docs.musixmatch.com/api-reference/lyrics-catalog/artist-search))
- `artistAlbumsGet` ([artist.albums.get](https://docs.musixmatch.com/api-reference/lyrics-catalog/artist-albums-get))

<!-- Album -->
- `albumGet` ([album.get](https://docs.musixmatch.com/api-reference/lyrics-catalog/album-get))
- `albumTracksGet` ([album.tracks.get](https://docs.musixmatch.com/api-reference/lyrics-catalog/album-tracks-get))

<!-- Enterprise -->
- `trackLyricsFingerprintPost` ([track.lyrics.fingerprint](https://docs.musixmatch.com/enterprise-integration/api-reference/track-lyrics-fingerprint-post))

## Examples

For more comprehensive usage examples including TypeScript and JavaScript (ESM/CJS), check the [`examples/`](./examples) directory.

## Test
> [!NOTE]
> To keep consistency over time and to be sure each endpoint returns the expected result, `e2e` tests are run against the actual Musixmatch APIs when a valid API key is provided (environment variable `MXM_API_KEY`). Instead `e2e` will be skipped.

- `pnpm test`

## Stay in touch

- Author - [Andrea Francesco Speziale](https://x.com/andreafspeziale)

## License

mxm-client [MIT licensed](LICENSE).
