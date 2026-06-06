import { MxmClient } from '@andreafspeziale/mxm-client';

const MXM_API_KEY = process.env.MXM_API_KEY;

const client = new MxmClient({
  config: {
    enableLog: true,
    apiKey: MXM_API_KEY,
    defaultLoggerConfig: {
      level: 'debug',
    },
  },
});

(async () => {
  await client
    .trackLyricsFingerprintPost({
      body: {
        text: "Fratelli d'Italia, l'Italia s'è desta\nDell'elmo di Scipio s'è cinta la testa\nDov'è la Vittoria? Le porga la chioma\nChe schiava di Roma Iddio la creò",
      },
    })
    .catch((_) => {
      process.exit(1);
    });

  /**
   * Generic enrichment: extending the body type with extra fields.
   *
   * In TypeScript you would define:
   *
   *   interface MyBody extends TrackLyricsFingerprintPostBody {
   *     settings: { algorithm: string };
   *   }
   *
   *   await client.trackLyricsFingerprintPost<
   *     TrackLyricsFingerprintPostQuery,
   *     MyBody
   *   >({ body: { text: '...', settings: { algorithm: 'raw' } } });
   */
  await client
    .trackLyricsFingerprintPost({
      body: {
        text: "Fratelli d'Italia, l'Italia s'è desta\nDell'elmo di Scipio s'è cinta la testa\nDov'è la Vittoria? Le porga la chioma\nChe schiava di Roma Iddio la creò",
        settings: { algorithm: 'raw' },
      },
    })
    .catch((_) => {
      process.exit(1);
    });

  process.exit(0);
})();
