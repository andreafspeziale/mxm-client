import { type Logger, pino } from 'pino';
import t from 'tap';
import { MxmClient } from './mxm-client.client.js';

t.test('MxmClient (spec)', (t) => {
  t.test('Should instantiate with minimal configuration', async (t) => {
    const client = new MxmClient({});

    t.ok(client instanceof MxmClient);
    t.ok(client['client']);
    t.notOk(client['config']);
    t.notOk(client['logger']);
  });

  t.test('Should instantiate with apiKey configuration', async (t) => {
    const apiKey = 'test-api-key';
    const client = new MxmClient({
      config: {
        apiKey,
      },
    });

    t.ok(client instanceof MxmClient);
    t.ok(client['config']);
    t.equal(client['config']?.apiKey, apiKey);
    t.notOk(client['logger']);
  });

  t.test(
    'Should instantiate with logging enabled and default logger config',
    async (t) => {
      const client = new MxmClient({
        config: {
          enableLog: true,
        },
      });

      t.ok(client instanceof MxmClient);
      t.ok(client['config']);
      t.ok(client['logger']);
      t.equal(client['logger']?.constructor.name, 'Pino');
    },
  );

  t.test(
    'Should instantiate with logging enabled and custom logger config',
    async (t) => {
      const client = new MxmClient({
        config: {
          enableLog: true,
          defaultLoggerConfig: {
            level: 'debug',
          },
        },
      });

      t.ok(client instanceof MxmClient);
      t.ok(client['config']);
      t.ok(client['logger']);
      t.equal(client['logger']?.constructor.name, 'Pino');
    },
  );

  t.test('Should instantiate with external logger', async (t) => {
    const externalLogger = pino({ level: 'info' });
    const client = new MxmClient({
      config: {
        enableLog: true,
      },
      logger: externalLogger,
    });

    t.ok(client instanceof MxmClient);
    t.ok(client['config']);
    t.ok(client['logger']);
    t.equal(client['logger']?.constructor.name, 'Pino');
  });

  t.test(
    'Should instantiate with external logger that has child method',
    async (t) => {
      const externalLogger = pino({ level: 'info' });
      let capturedArgs = null;
      const originalChild = externalLogger.child.bind(externalLogger);
      externalLogger.child = (bindings) => {
        capturedArgs = bindings;
        return originalChild(bindings);
      };

      const client = new MxmClient({
        config: {
          enableLog: true,
        },
        logger: externalLogger,
      });

      t.ok(client instanceof MxmClient);
      t.ok(client['logger']);
      t.ok(capturedArgs);
      t.same(capturedArgs, { context: 'MxmClient' });
    },
  );

  t.test(
    'Should instantiate with external logger without child method',
    async (t) => {
      const externalLogger = {
        info: () => {},
        error: () => {},
        warn: () => {},
        debug: () => {},
      } as unknown as Logger;

      const client = new MxmClient({
        config: {
          enableLog: true,
        },
        logger: externalLogger,
      });

      t.ok(client instanceof MxmClient);
      t.ok(client['logger']);
      t.equal(client['logger'], externalLogger);
    },
  );

  t.test('Should not create logger when enableLog is false', async (t) => {
    const externalLogger = pino({ level: 'info' });

    const client = new MxmClient({
      config: {
        enableLog: false,
      },
      logger: externalLogger,
    });

    t.ok(client instanceof MxmClient);
    t.ok(client['config']);
    t.notOk(client['logger']);
  });

  t.test('Should not create logger when config is not provided', async (t) => {
    const externalLogger = pino({ level: 'info' });

    const client = new MxmClient({
      logger: externalLogger,
    });

    t.ok(client instanceof MxmClient);
    t.notOk(client['config']);
    t.notOk(client['logger']);
  });

  t.test('Should instantiate with custom baseUrl', async (t) => {
    const client = new MxmClient({
      config: {
        baseUrl: 'https://staging.musixmatch.com',
      },
    });

    t.ok(client instanceof MxmClient);
    t.ok(client['client']);
    t.equal(client['config']?.baseUrl, 'https://staging.musixmatch.com');
  });

  t.test(
    'Should instantiate with custom baseUrl stripping trailing slash',
    async (t) => {
      const client = new MxmClient({
        config: {
          baseUrl: 'https://staging.musixmatch.com/',
        },
      });

      t.ok(client instanceof MxmClient);
      t.ok(client['client']);
    },
  );

  t.test('Should instantiate with full configuration', async (t) => {
    const apiKey = 'test-api-key';
    const externalLogger = pino({ level: 'debug' });

    const client = new MxmClient({
      config: {
        apiKey,
        baseUrl: 'https://custom.musixmatch.com',
        enableLog: true,
        defaultLoggerConfig: {
          level: 'trace',
        },
      },
      logger: externalLogger,
    });

    t.ok(client instanceof MxmClient);
    t.ok(client['config']);
    t.equal(client['config']?.apiKey, apiKey);
    t.equal(client['config']?.baseUrl, 'https://custom.musixmatch.com');
    t.ok(client['logger']);
  });

  t.end();
});
