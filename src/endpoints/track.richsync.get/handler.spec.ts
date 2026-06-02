import t from 'tap';
import { MockAgent, setGlobalDispatcher } from 'undici';
import { MxmClientError } from '../../mxm-client.error.js';
import { buildUrl } from '../../mxm-client.utils.js';
import { METHOD, TRACK_RICH_SYNC_GET_ENDPOINT } from './constants.js';
import { trackRichSyncGet } from './handler.js';

const url = 'http://some-fake-url.example.com';
const mockAgent = new MockAgent();
mockAgent.disableNetConnect();

setGlobalDispatcher(mockAgent);

const client = mockAgent.get(url);

t.test('track.richsync.get (spec)', (t) => {
  t.test('Should return the expected response', async (t) => {
    const expectedResponse = {
      message: {
        header: {
          status_code: 200,
          execute_time: 0.345,
        },
        body: {
          richsync: {
            richsync_id: 123456,
            richsync_body:
              '[{"ts":7.02,"te":10.5,"l":[{"c":"Hello, ","o":0}]},{"ts":274.43,"te":278.5,"l":[{"c":"it clearly doesn\'t tear you apart anymore","o":0}]}]',
            richsync_length: 245,
            richsync_avg_count: 15,
            richssync_language: 'en',
            richsync_language_description: 'English',
            lyrics_copyright: 'Lyrics powered by www.musixmatch.com',
            restricted: 0,
            html_tracking_url: 'https://tracking.musixmatch.com/...',
            pixel_tracking_url: 'https://tracking.musixmatch.com/...',
            script_tracking_url: 'https://tracking.musixmatch.com/...',
            updated_time: '2024-03-25T21:52:49Z',
            publisher_list: [],
            writer_list: [],
          },
        },
      },
    };

    const query = {
      apiKey: 'fake-api-key',
      track_isrc: 'USUM71703861',
    };

    const path = await buildUrl({
      endpoint: TRACK_RICH_SYNC_GET_ENDPOINT,
      query,
      method: METHOD,
      errorToBeInitialized: MxmClientError,
    });

    client
      .intercept({
        path,
        method: METHOD,
      })
      .reply(200, expectedResponse);

    const r = await trackRichSyncGet({
      input: { query },
      client,
    });

    t.strictSame(r, expectedResponse, 'Should return the expected response');
  });

  t.test('Should throw when api-key is not provided', async (t) => {
    const query = {
      track_isrc: 'USUM71703861',
    };

    await t.rejects(
      trackRichSyncGet({
        input: { query },
        client,
      }),
      {
        message: 'API key is required',
      },
    );
  });

  t.test('Should throw when unexpected statusCode', async (t) => {
    const statusCode = 500;

    const query = {
      apiKey: 'fake-api-key',
      track_isrc: 'USUM71703861',
    };

    const path = await buildUrl({
      endpoint: TRACK_RICH_SYNC_GET_ENDPOINT,
      query,
      method: METHOD,
      errorToBeInitialized: MxmClientError,
    });

    client
      .intercept({
        path,
        method: METHOD,
      })
      .reply(statusCode, {});

    await t.rejects(
      trackRichSyncGet({
        input: { query },
        client,
      }),
      {
        message: `Unexpected statusCode, received ${statusCode}`,
      },
    );
  });

  t.test(
    'Should throw when correct statusCode but unexpected response message statusCode',
    async (t) => {
      const response = {
        message: {
          header: {
            status_code: 500,
            execute_time: 0.345,
          },
          body: {},
        },
      };

      const query = {
        apiKey: 'fake-api-key',
        track_isrc: 'USUM71703861',
      };

      const path = await buildUrl({
        endpoint: TRACK_RICH_SYNC_GET_ENDPOINT,
        query,
        method: METHOD,
        errorToBeInitialized: MxmClientError,
      });

      client
        .intercept({
          path,
          method: METHOD,
        })
        .reply(200, response);

      await t.rejects(
        trackRichSyncGet({
          input: { query },
          client,
        }),
        {
          message: 'Unexpected response data shape',
        },
      );
    },
  );

  t.test(
    'Should throw when correct statusCode, correct response message statusCode but unexpected response shape',
    async (t) => {
      const response = {
        message: {
          header: {
            status_code: 200,
            execute_time: 0.345,
          },
          body: {
            richsync: {
              richsync_id: '123456',
              richsync_body:
                '[{"ts":7.02,"te":10.5,"l":[{"c":"Hello, ","o":0}]}]',
              richsync_length: 245,
              richsync_avg_count: 15,
              richsync_language: 'en',
              richsync_language_description: 'English',
              lyrics_copyright: 'Lyrics powered by www.musixmatch.com',
              restricted: 0,
              html_tracking_url: 'https://tracking.musixmatch.com/...',
              pixel_tracking_url: 'https://tracking.musixmatch.com/...',
              script_tracking_url: 'https://tracking.musixmatch.com/...',
              updated_time: '2024-03-25T21:52:49Z',
              publisher_list: [],
              writer_list: [],
            },
          },
        },
      };

      const query = {
        apiKey: 'fake-api-key',
        track_isrc: 'USUM71703861',
      };

      const path = await buildUrl({
        endpoint: TRACK_RICH_SYNC_GET_ENDPOINT,
        query,
        method: METHOD,
        errorToBeInitialized: MxmClientError,
      });

      client
        .intercept({
          path,
          method: METHOD,
        })
        .reply(200, response);

      await t.rejects(
        trackRichSyncGet({
          input: { query },
          client,
        }),
        {
          message: 'Unexpected response data shape',
        },
      );
    },
  );

  t.test('Should throw for an unexpected error', async (t) => {
    const query = {
      apiKey: 'fake-api-key',
      track_isrc: 'USUM71703861',
    };

    const path = await buildUrl({
      endpoint: TRACK_RICH_SYNC_GET_ENDPOINT,
      query,
      method: METHOD,
      errorToBeInitialized: MxmClientError,
    });

    client
      .intercept({
        path,
        method: METHOD,
      })
      .replyWithError(new Error('Unexpected error'));

    await t.rejects(
      trackRichSyncGet({
        input: { query },
        client,
      }),
      {
        message: 'Something went wrong during the request',
      },
    );
  });

  t.end();
});
