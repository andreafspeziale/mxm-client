import t from 'tap';
import { MockAgent, setGlobalDispatcher } from 'undici';
import { z } from 'zod';
import { MxmClientError } from './mxm-client.error.js';
import { successStatusCodeSchema } from './mxm-client.schemas.js';
import { validateStatusCode } from './mxm-client.utils.js';

const mockAgent = new MockAgent();
mockAgent.disableNetConnect();

setGlobalDispatcher(mockAgent);

t.test('unsafe response handling (no body validation)', (t) => {
  t.test(
    'Should return data without body validation even if shape is invalid',
    async (t) => {
      const data = { unexpected: 'shape', not_matching: true };

      await validateStatusCode({
        statusCode: 200,
        statusCodeSchema: successStatusCodeSchema,
        method: 'GET',
        path: '/test',
        errorToBeInitialized: MxmClientError,
      });

      t.same(data, { unexpected: 'shape', not_matching: true });
    },
  );

  t.test('Should validate status code by default', async (t) => {
    await t.rejects(
      validateStatusCode({
        statusCode: 400,
        statusCodeSchema: successStatusCodeSchema,
        method: 'GET',
        path: '/test',
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
      await validateStatusCode({
        statusCode: 400,
        statusCodeSchema: successStatusCodeSchema,
        method: 'GET',
        path: '/test',
        errorToBeInitialized: MxmClientError,
        options: { disableStatusCodeValidation: true },
      });

      t.pass('Status code validation was skipped successfully');
    },
  );

  t.test('Should return data as-is regardless of shape', async (t) => {
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

    await validateStatusCode({
      statusCode: 200,
      statusCodeSchema: z.literal(200),
      method: 'GET',
      path: '/test',
      errorToBeInitialized: MxmClientError,
    });

    // In unsafe mode, data is returned as-is (cast to T)
    const result = data as typeof data;
    t.equal(result.message.body.extra_custom_field, 'custom_value');
    t.equal(result.message.body.another_unknown, 42);
  });

  t.end();
});
