import t from 'tap';
import { MockAgent, setGlobalDispatcher } from 'undici';
import { z } from 'zod';
import { TRACK_GET_ENDPOINT } from './endpoints/track.get/definition.js';
import { MxmClientError } from './mxm-client.error.js';
import {
  legacyResponseWrapperSchema,
  successStatusCodeSchema,
} from './mxm-client.schemas.js';
import { buildUrl, handleResponseWithSchema } from './mxm-client.utils.js';

const mockAgent = new MockAgent();
mockAgent.disableNetConnect();

setGlobalDispatcher(mockAgent);

t.test('handleResponseWithSchema', (t) => {
  const validData = {
    message: {
      header: { status_code: 200, execute_time: 0.1 },
      body: { track_name: 'Hello', custom_field: 'extra' },
    },
  };

  const customBodySchema = z.object({
    track_name: z.string(),
    custom_field: z.string(),
  });

  t.test(
    'Should validate and return data using custom Standard Schema (body-level)',
    async (t) => {
      const result = await handleResponseWithSchema({
        method: 'GET',
        path: '/test',
        statusCode: 200,
        data: validData,
        statusCodeSchema: successStatusCodeSchema,
        responseSchema: customBodySchema,
        wrapperSchema: legacyResponseWrapperSchema,
        errorToBeInitialized: MxmClientError,
      });

      t.same(result, validData);
    },
  );

  t.test('Should throw when custom schema validation fails', async (t) => {
    const invalidData = {
      message: {
        header: { status_code: 200, execute_time: 0.1 },
        body: { track_name: 'Hello', custom_field: 123 },
      },
    };

    await t.rejects(
      handleResponseWithSchema({
        method: 'GET',
        path: '/test',
        statusCode: 200,
        data: invalidData,
        statusCodeSchema: successStatusCodeSchema,
        responseSchema: customBodySchema,
        wrapperSchema: legacyResponseWrapperSchema,
        errorToBeInitialized: MxmClientError,
      }),
      {
        message: 'Unexpected response data shape',
      },
    );
  });

  t.test('Should throw when wrapper structure is invalid', async (t) => {
    const malformedData = {
      unexpected: 'shape',
    };

    await t.rejects(
      handleResponseWithSchema({
        method: 'GET',
        path: '/test',
        statusCode: 200,
        data: malformedData,
        statusCodeSchema: successStatusCodeSchema,
        responseSchema: customBodySchema,
        wrapperSchema: legacyResponseWrapperSchema,
        errorToBeInitialized: MxmClientError,
      }),
      {
        message: 'Unexpected response wrapper shape',
      },
    );
  });

  t.test('Should validate status code by default', async (t) => {
    await t.rejects(
      handleResponseWithSchema({
        method: 'GET',
        path: '/test',
        statusCode: 400,
        data: validData,
        statusCodeSchema: successStatusCodeSchema,
        responseSchema: customBodySchema,
        wrapperSchema: legacyResponseWrapperSchema,
        errorToBeInitialized: MxmClientError,
      }),
      {
        message: 'Unexpected statusCode, received 400',
      },
    );
  });

  t.test(
    'Should skip status code validation when disableStatusCodeValidation is true',
    async (t) => {
      const result = await handleResponseWithSchema({
        method: 'GET',
        path: '/test',
        statusCode: 400,
        data: validData,
        statusCodeSchema: successStatusCodeSchema,
        responseSchema: customBodySchema,
        wrapperSchema: legacyResponseWrapperSchema,
        errorToBeInitialized: MxmClientError,
        options: { disableStatusCodeValidation: true },
      });

      t.same(result, validData);
    },
  );

  t.test(
    'Should preserve header.available when present in response',
    async (t) => {
      const dataWithAvailable = {
        message: {
          header: { status_code: 200, execute_time: 0.1, available: 42 },
          body: { track_name: 'Hello', custom_field: 'extra' },
        },
      };

      const result = await handleResponseWithSchema({
        method: 'GET',
        path: '/test',
        statusCode: 200,
        data: dataWithAvailable,
        statusCodeSchema: successStatusCodeSchema,
        responseSchema: customBodySchema,
        wrapperSchema: legacyResponseWrapperSchema,
        errorToBeInitialized: MxmClientError,
      });

      t.equal(result.message.header.available, 42);
    },
  );

  t.end();
});

t.test('responseSchema via execute path (integration)', (t) => {
  const mockPool = mockAgent.get('http://test-host.example.com');

  const apiResponse = {
    message: {
      header: { status_code: 200, execute_time: 0.1 },
      body: {
        track: {
          track_id: 123,
          track_name: 'Hello',
          custom_field: 'my_value',
          extra_field: 'ignored_by_passthrough',
        },
      },
    },
  };

  const customBodySchema = z
    .object({
      track: z
        .object({
          track_id: z.number(),
          track_name: z.string(),
          custom_field: z.string(),
        })
        .passthrough(),
    })
    .passthrough();

  t.test(
    'Should validate response with custom responseSchema end-to-end',
    async (t) => {
      const query = { apiKey: 'fake-api-key', track_isrc: 'USUM72005901' };

      const path = await buildUrl({
        endpoint: TRACK_GET_ENDPOINT,
        query,
        method: 'GET',
        errorToBeInitialized: MxmClientError,
      });

      mockPool.intercept({ path, method: 'GET' }).reply(200, apiResponse);

      const { statusCode, data } = await import('./mxm-client.utils.js').then(
        (m) =>
          m.handleRequest({
            client: mockPool,
            method: 'GET',
            path,
            errorToBeInitialized: MxmClientError,
          }),
      );

      const result = await handleResponseWithSchema({
        method: 'GET',
        path,
        statusCode,
        data,
        statusCodeSchema: successStatusCodeSchema,
        responseSchema: customBodySchema,
        wrapperSchema: legacyResponseWrapperSchema,
        errorToBeInitialized: MxmClientError,
      });

      t.equal(result.message.body.track.track_name, 'Hello');
      t.equal(result.message.body.track.custom_field, 'my_value');
    },
  );

  t.test(
    'Should throw when responseSchema validation fails end-to-end',
    async (t) => {
      const badResponse = {
        message: {
          header: { status_code: 200, execute_time: 0.1 },
          body: { track: { track_id: 123, track_name: 'Hello' } },
        },
      };

      const query = { apiKey: 'fake-api-key', track_isrc: 'USUM72005901' };

      const path = await buildUrl({
        endpoint: TRACK_GET_ENDPOINT,
        query,
        method: 'GET',
        errorToBeInitialized: MxmClientError,
      });

      mockPool.intercept({ path, method: 'GET' }).reply(200, badResponse);

      const { statusCode, data } = await import('./mxm-client.utils.js').then(
        (m) =>
          m.handleRequest({
            client: mockPool,
            method: 'GET',
            path,
            errorToBeInitialized: MxmClientError,
          }),
      );

      await t.rejects(
        handleResponseWithSchema({
          method: 'GET',
          path,
          statusCode,
          data,
          statusCodeSchema: successStatusCodeSchema,
          responseSchema: customBodySchema,
          wrapperSchema: legacyResponseWrapperSchema,
          errorToBeInitialized: MxmClientError,
        }),
        { message: 'Unexpected response data shape' },
      );
    },
  );

  t.end();
});
