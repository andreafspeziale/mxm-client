import t from 'tap';
import { MockAgent, setGlobalDispatcher } from 'undici';
import { z } from 'zod';
import { MxmClientError } from './mxm-client.error.js';
import { successStatusCodeSchema } from './mxm-client.schemas.js';
import { handleResponse } from './mxm-client.utils.js';

const mockAgent = new MockAgent();
mockAgent.disableNetConnect();

setGlobalDispatcher(mockAgent);

t.test('handleResponse without dataSchema (unsafe mode)', (t) => {
  t.test(
    'Should return data without body validation even if shape is invalid',
    async (t) => {
      const data = { unexpected: 'shape', not_matching: true };

      const result = await handleResponse<typeof data, unknown>({
        method: 'GET',
        path: '/test',
        statusCode: 200,
        data,
        statusCodeSchema: successStatusCodeSchema,
        errorToBeInitialized: MxmClientError,
      });

      t.same(result, data);
    },
  );

  t.test('Should validate status code by default', async (t) => {
    const data = { foo: 'bar' };

    await t.rejects(
      handleResponse({
        method: 'GET',
        path: '/test',
        statusCode: 400,
        data,
        statusCodeSchema: successStatusCodeSchema,
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
      const data = { foo: 'bar' };

      const result = await handleResponse<typeof data, unknown>({
        method: 'GET',
        path: '/test',
        statusCode: 400,
        data,
        statusCodeSchema: successStatusCodeSchema,
        errorToBeInitialized: MxmClientError,
        options: { disableStatusCodeValidation: true },
      });

      t.same(result, data);
    },
  );

  t.test(
    'Should return data as-is when schema would normally fail',
    async (t) => {
      const data = {
        message: {
          header: { status_code: 200, execute_time: 0.1 },
          body: {
            known_field: 'value',
            extra_custom_field: 'custom_value',
            another_unknown: 42,
          },
        },
      };

      const result = await handleResponse<typeof data, unknown>({
        method: 'GET',
        path: '/test',
        statusCode: 200,
        data,
        statusCodeSchema: z.literal(200),
        errorToBeInitialized: MxmClientError,
      });

      t.same(result, data);
      t.equal(result.message.body.extra_custom_field, 'custom_value');
      t.equal(result.message.body.another_unknown, 42);
    },
  );

  t.end();
});
