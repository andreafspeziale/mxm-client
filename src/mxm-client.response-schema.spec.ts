import t from 'tap';
import { z } from 'zod';
import { MxmClientError } from './mxm-client.error.js';
import { successStatusCodeSchema } from './mxm-client.schemas.js';
import { handleResponseWithSchema } from './mxm-client.utils.js';

t.test('handleResponseWithSchema', (t) => {
  const validData = {
    message: {
      header: { status_code: 200, execute_time: 0.1 },
      body: { track_name: 'Hello', custom_field: 'extra' },
    },
  };

  const customSchema = z.object({
    message: z.object({
      header: z.object({
        status_code: z.literal(200),
        execute_time: z.number(),
      }),
      body: z.object({
        track_name: z.string(),
        custom_field: z.string(),
      }),
    }),
  });

  t.test(
    'Should validate and return data using custom Standard Schema',
    async (t) => {
      const result = await handleResponseWithSchema({
        method: 'GET',
        path: '/test',
        statusCode: 200,
        data: validData,
        statusCodeSchema: successStatusCodeSchema,
        responseSchema: customSchema,
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
        responseSchema: customSchema,
        errorToBeInitialized: MxmClientError,
      }),
      {
        message: 'Unexpected response data shape',
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
        responseSchema: customSchema,
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
        responseSchema: customSchema,
        errorToBeInitialized: MxmClientError,
        options: { disableStatusCodeValidation: true },
      });

      t.same(result, validData);
    },
  );

  t.end();
});
