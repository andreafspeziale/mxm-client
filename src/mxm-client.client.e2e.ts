import t from 'tap';
import { MxmClient } from './mxm-client.client.js';

const MXM_API_KEY = process.env['MXM_API_KEY'];

const client = new MxmClient({
  config: {
    apiKey: MXM_API_KEY,
  },
});

// NOTE: tests expect a valid and properly configured MXM_API_KEY in env vars
t.test(
  'MxmClient (e2e)',
  {
    skip:
      typeof MXM_API_KEY !== 'string' || MXM_API_KEY === ''
        ? 'missing MXM_API_KEY'
        : false,
  },
  (t) => {
    t.test('album.get', async (t) => {
      await t.resolves(
        client.albumGet({
          query: { album_id: '56126508' },
        }),
      );
    });

    t.test('album.tracks.get', async (t) => {
      await t.resolves(
        client.albumTracksGet({
          query: { album_id: '32540723' },
        }),
      );
    });

    t.test('artist.get', async (t) => {
      await t.resolves(
        client.artistGet({
          query: { artist_id: '259675' },
        }),
      );
    });

    t.test('artist.albums.get', async (t) => {
      await t.resolves(
        client.artistAlbumsGet({
          query: { artist_id: '259675' },
        }),
      );
    });

    t.test('artist.search', async (t) => {
      await t.resolves(
        client.artistSearch({
          query: { q_artist: 'Taylor Swift' },
        }),
      );
    });

    t.test('matcher.lyrics.get', async (t) => {
      await t.resolves(
        client.matcherLyricsGet({
          query: { track_isrc: 'GBAAA9100070' },
        }),
      );
    });

    t.test('matcher.subtitle.get', async (t) => {
      await t.resolves(
        client.matcherSubtitleGet({
          query: { track_isrc: 'GBAAA9100070' },
        }),
      );
    });

    t.test('matcher.track.get', async (t) => {
      await t.resolves(
        client.matcherTrackGet({
          query: { track_isrc: 'GBAAA9100070' },
        }),
      );
    });

    t.test('track.get', async (t) => {
      await t.resolves(
        client.trackGet({
          query: { track_isrc: 'GBAAA9100070' },
        }),
      );
    });

    t.test('track.lyrics.analysis.search', async (t) => {
      await t.resolves(
        client.trackLyricsAnalysisSearch({
          body: {
            meaning: 'songs about love and heartbreak',
            moods: ['Love', 'Heartbreak'],
            lyrics_language: 'en',
          },
          query: { page: '1', page_size: '2' },
        }),
      );
    });

    t.test('track.lyrics.fingerprint.post', async (t) => {
      await t.resolves(
        client.trackLyricsFingerprintPost({
          body: {
            text: "Fratelli d'Italia l'Italia s'è desta, dell'elmo di Scipio s'è cinta la testa. Dov'è la Vittoria? Le porga la chioma, ché schiava di Roma Iddio la creò.",
          },
        }),
      );
    });

    t.test('track.lyrics.get', async (t) => {
      await t.resolves(
        client.trackLyricsGet({
          query: { track_isrc: 'GBAAA9100070' },
        }),
      );
    });

    t.test('track.subtitle.get', async (t) => {
      await t.resolves(
        client.trackSubtitleGet({
          query: { track_isrc: 'GBAAA9100070' },
        }),
      );
    });

    t.test('track.richsync.get', async (t) => {
      await t.resolves(
        client.trackRichSyncGet({
          query: { track_isrc: 'GBAAA9100070' },
        }),
      );
    });

    t.test('track.search', async (t) => {
      await t.resolves(
        client.trackSearch({
          query: { q_track: 'Hello', q_artist: 'Adele' },
        }),
      );
    });

    t.test('track.snippet.get', async (t) => {
      await t.resolves(
        client.trackSnippetGet({
          query: { track_isrc: 'GBAAA9100070' },
        }),
      );
    });

    t.end();
  },
);
