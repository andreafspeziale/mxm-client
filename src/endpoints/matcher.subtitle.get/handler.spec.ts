import t from 'tap';
import { MockAgent, setGlobalDispatcher } from 'undici';
import { MxmClientError } from '../../mxm-client.error.js';
import { buildUrl } from '../../mxm-client.utils.js';
import { MATCHER_SUBTITLE_GET_ENDPOINT, METHOD } from './constants.js';
import { matcherSubtitleGet } from './handler.js';

const url = 'http://some-fake-url.example.com';
const mockAgent = new MockAgent();
mockAgent.disableNetConnect();

setGlobalDispatcher(mockAgent);

const client = mockAgent.get(url);

t.test('matcher.subtitle.get (spec)', (t) => {
  t.test('Should return the expected response', async (t) => {
    const expectedResponse = {
      message: {
        header: {
          status_code: 200,
          execute_time: 0.345,
        },
        body: {
          subtitle: {
            subtitle_id: 1,
            subtitle_body:
              "[00:07.02] Hello, it's me\n[04:34.43] But it don't matter, it clearly doesn't tear you apart anymore\n[04:42.94] ",
            lyrics_copyright: 'Lyrics powered by www.musixmatch.com',
            subtitle_length: 1,
            subtitle_language: 'en',
            subtitle_language_description: 'English',
            script_tracking_url: 'https://tracking.musixmatch.com/...',
            pixel_tracking_url: 'https://tracking.musixmatch.com/...',
            updated_time: '2024-03-25T21:52:49Z',
          },
        },
      },
    };

    const query = {
      apiKey: 'fake-api-key',
      track_isrc: 'USUM71703861',
    };

    const path = await buildUrl({
      endpoint: MATCHER_SUBTITLE_GET_ENDPOINT,
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

    const r = await matcherSubtitleGet({
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
      matcherSubtitleGet({
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
      endpoint: MATCHER_SUBTITLE_GET_ENDPOINT,
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
      matcherSubtitleGet({
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
        endpoint: MATCHER_SUBTITLE_GET_ENDPOINT,
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
        matcherSubtitleGet({
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
            subtitle: {
              subtitle_id: 1,
              subtitle_body:
                "[00:07.02] Hello, it's me\n[04:34.43] But it don't matter, it clearly doesn't tear you apart anymore\n[04:42.94] ",
              lyrics_copyright: 'Lyrics powered by www.musixmatch.com',
              subtitle_length: '1',
              subtitle_language: 'en',
              subtitle_language_description: 'English',
              script_tracking_url: 'https://tracking.musixmatch.com/...',
              pixel_tracking_url: 'https://tracking.musixmatch.com/...',
              updated_time: '2024-03-25T21:52:49Z',
            },
          },
        },
      };

      const query = {
        apiKey: 'fake-api-key',
        track_isrc: 'USUM71703861',
      };

      const path = await buildUrl({
        endpoint: MATCHER_SUBTITLE_GET_ENDPOINT,
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
        matcherSubtitleGet({
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
      endpoint: MATCHER_SUBTITLE_GET_ENDPOINT,
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
      matcherSubtitleGet({
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
