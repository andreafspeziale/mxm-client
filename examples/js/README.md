# Examples

<!-- TODO: update package.json with the actual distributed package -->
Here you can find some examples of how to use the package in your project and its logging capabilities.

## Quickstart

- `pnpm install`
- `export MXM_API_KEY=your_api_key_here`
- `pnpm run start:mjs`

## Logs

### Missing API key

```sh
~/Repositories/os/mxm-client/examples/js → pnpm run start:mjs

> mxm-client-examples@ start:mjs /Users/andreafspeziale/Repositories/os/mxm-client/examples/js
> node index.mjs | pino-pretty

[00:43:09.003] DEBUG (10512): Performing fingerprint by input text...
    context: "MxmClient"
    fn: "trackLyricsFingerprintPost"
    method: "POST"
    endpoint: "/ws/1.1/track.lyrics.fingerprint.post"
    input: {
      "query": {},
      "body": {
        "text": "Fratelli d'Italia, l'Italia s'è desta\nDell'elmo di Scipio s'è cinta la testa\nDov'è la Vittoria? Le porga la chioma\nChe schiava di Roma Iddio la creò"
      }
    }
[00:43:09.003] ERROR (10512): API key is required
    context: "MxmClient"
    fn: "throwAPIError"
    method: "POST"
    endpoint: "/ws/1.1/track.lyrics.fingerprint.post"
    cause: {
      "name": "ZodValidationError",
      "details": [
        {
          "expected": "string",
          "code": "invalid_type",
          "path": [],
          "message": "Invalid input: expected string, received undefined"
        }
      ]
    }
~/Repositories/os/mxm-client/examples/js →
```

### Invalid API key

```sh
~/Repositories/os/mxm-client/examples/js → export MXM_API_KEY=xyz
~/Repositories/os/mxm-client/examples/js → pnpm run start:mjs

> mxm-client-examples@ start:mjs /Users/andreafspeziale/Repositories/os/mxm-client/examples/js
> node index.mjs | pino-pretty

[00:43:21.739] DEBUG (10535): Performing fingerprint by input text...
    context: "MxmClient"
    fn: "trackLyricsFingerprintPost"
    method: "POST"
    endpoint: "/ws/1.1/track.lyrics.fingerprint.post"
    input: {
      "query": {
        "apiKey": "xyz"
      },
      "body": {
        "text": "Fratelli d'Italia, l'Italia s'è desta\nDell'elmo di Scipio s'è cinta la testa\nDov'è la Vittoria? Le porga la chioma\nChe schiava di Roma Iddio la creò"
      }
    }
[00:43:21.740] DEBUG (10535): Handling request...
    context: "MxmClient"
    fn: "handleRequest"
    method: "POST"
    path: "/ws/1.1/track.lyrics.fingerprint.post?apikey=xyz"
    headers: {
      "content-type": "application/json"
    }
    body: {
      "data": {
        "text": "Fratelli d'Italia, l'Italia s'è desta\nDell'elmo di Scipio s'è cinta la testa\nDov'è la Vittoria? Le porga la chioma\nChe schiava di Roma Iddio la creò"
      }
    }
[00:43:22.229] DEBUG (10535): Handling response...
    context: "MxmClient"
    fn: "handleResponse"
    method: "POST"
    path: "/ws/1.1/track.lyrics.fingerprint.post?apikey=xyz"
    statusCode: 200
    data: {
      "message": {
        "header": {
          "status_code": 401,
          "execute_time": 0.037735939025879
        },
        "body": []
      }
    }
[00:43:22.230] ERROR (10535): Unexpected response data shape
    context: "MxmClient"
    fn: "throwAPIError"
    method: "POST"
    path: "/ws/1.1/track.lyrics.fingerprint.post?apikey=xyz"
    statusCode: 200
    data: {
      "message": {
        "header": {
          "status_code": 401,
          "execute_time": 0.037735939025879
        },
        "body": []
      }
    }
    cause: {
      "name": "ZodValidationError",
      "details": [
        {
          "code": "invalid_value",
          "values": [
            200
          ],
          "path": [
            "message",
            "header",
            "status_code"
          ],
          "message": "Invalid input: expected 200"
        },
        {
          "expected": "object",
          "code": "invalid_type",
          "path": [
            "message",
            "body"
          ],
          "message": "Invalid input: expected object, received array"
        }
      ]
    }
~/Repositories/os/mxm-client/examples/js →
```

### Valid API key

```sh
~/Repositories/os/mxm-client/examples/js → pnpm run start:mjs

> mxm-client-examples@ start:mjs /Users/andreafspeziale/Repositories/os/mxm-client/examples/js
> node index.mjs | pino-pretty

[00:43:38.309] DEBUG (10558): Performing fingerprint by input text...
    context: "MxmClient"
    fn: "trackLyricsFingerprintPost"
    method: "POST"
    endpoint: "/ws/1.1/track.lyrics.fingerprint.post"
    input: {
      "query": {
        "apiKey": "[Redacted]"
      },
      "body": {
        "text": "Fratelli d'Italia, l'Italia s'è desta\nDell'elmo di Scipio s'è cinta la testa\nDov'è la Vittoria? Le porga la chioma\nChe schiava di Roma Iddio la creò"
      }
    }
[00:43:38.309] DEBUG (10558): Handling request...
    context: "MxmClient"
    fn: "handleRequest"
    method: "POST"
    path: "[Redacted]"
    headers: {
      "content-type": "application/json"
    }
    body: {
      "data": {
        "text": "Fratelli d'Italia, l'Italia s'è desta\nDell'elmo di Scipio s'è cinta la testa\nDov'è la Vittoria? Le porga la chioma\nChe schiava di Roma Iddio la creò"
      }
    }
[00:43:38.713] DEBUG (10558): Handling response...
    context: "MxmClient"
    fn: "handleResponse"
    method: "POST"
    path: "[Redacted]"
    statusCode: 200
    data: {
      "message": {
        "header": {
          "status_code": 200,
          "execute_time": 0.14805698394775
        },
        "body": {
          "track_list": [
            {
              "similarity": 100,
              "track": "[Redacted]"
            },
            {
              "similarity": 97.761194029851,
              "track": "[Redacted]"
            },
            ...
          ]
        }
      }
    }
[00:43:38.714] DEBUG (10558): Performing fingerprint by input text...
    context: "MxmClient"
    fn: "trackLyricsFingerprintPost"
    method: "POST"
    endpoint: "/ws/1.1/track.lyrics.fingerprint.post"
    input: {
      "query": {
        "apiKey": "[Redacted]"
      },
      "body": {
        "text": "Fratelli d'Italia, l'Italia s'è desta\nDell'elmo di Scipio s'è cinta la testa\nDov'è la Vittoria? Le porga la chioma\nChe schiava di Roma Iddio la creò",
        "settings": {
          "algorithm": "raw"
        }
      }
    }
[00:43:38.714] DEBUG (10558): Handling request...
    context: "MxmClient"
    fn: "handleRequest"
    method: "POST"
    path: "[Redacted]"
    headers: {
      "content-type": "application/json"
    }
    body: {
      "data": {
        "text": "Fratelli d'Italia, l'Italia s'è desta\nDell'elmo di Scipio s'è cinta la testa\nDov'è la Vittoria? Le porga la chioma\nChe schiava di Roma Iddio la creò"
      }
    }
[00:43:39.021] DEBUG (10558): Handling response...
    context: "MxmClient"
    fn: "handleResponse"
    method: "POST"
    path: "[Redacted]"
    statusCode: 200
    data: {
      "message": {
        "header": {
          "status_code": 200,
          "execute_time": 0.13247299194336
        },
        "body": {
          "track_list": [
            {
              "similarity": 100,
              "track": "[Redacted]"
            },
            {
              "similarity": 97.761194029851,
              "track": "[Redacted]"
            },
            ...
          ]
        }
      }
    }
~/Repositories/os/mxm-client/examples/js →
```
