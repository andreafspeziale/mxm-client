# Changelog

## [1.2.0](https://github.com/andreafspeziale/mxm-client/compare/1.1.0...1.2.0) (2026-06-07)

### Features

* add artist.albums.get endpoint ([#24](https://github.com/andreafspeziale/mxm-client/issues/24)) ([7ddf112](https://github.com/andreafspeziale/mxm-client/commit/7ddf112b0af31f8ac5343b4f75c22706da2ec6b3))
* add artist.get endpoint ([#22](https://github.com/andreafspeziale/mxm-client/issues/22)) ([92b33d1](https://github.com/andreafspeziale/mxm-client/commit/92b33d1e439425f50925d40a24ce465a5eb7736e))
* add languages get endpoint ([#23](https://github.com/andreafspeziale/mxm-client/issues/23)) ([624a25f](https://github.com/andreafspeziale/mxm-client/commit/624a25f766b644f5238b2bb84dfe54bea761a402))
* add track.lyrics.translation.get endpoint ([ff00657](https://github.com/andreafspeziale/mxm-client/commit/ff006574f9e552ceefc6d5938997e9088998c7e1))
* add track.snippet.get endpoint ([84a4f21](https://github.com/andreafspeziale/mxm-client/commit/84a4f2139378596db13959b3e1a84751e6702a2a))
* add track.subtitle.translation.get endpoint ([#21](https://github.com/andreafspeziale/mxm-client/issues/21)) ([a3d2482](https://github.com/andreafspeziale/mxm-client/commit/a3d2482637905b97dd5b365b78151782047733aa))

### Miscellaneous

* reorder README available methods by API category ([5c629af](https://github.com/andreafspeziale/mxm-client/commit/5c629afa5869e15949b3c003a248ceb3cd73ee32))
* update available methods in README ([820b883](https://github.com/andreafspeziale/mxm-client/commit/820b88399f75dd85082843de57233471f4244944))
* update available methods in README ([44106ac](https://github.com/andreafspeziale/mxm-client/commit/44106ac491d17640b4571c3d33d3f7fc93924b57))
* update dependency @types/node to v24.13.1 ([#16](https://github.com/andreafspeziale/mxm-client/issues/16)) ([fa1a41c](https://github.com/andreafspeziale/mxm-client/commit/fa1a41ca63542ab33dd00eacfbe37bd7731b8dcf))
* update dependency undici to v7.27.2 ([#17](https://github.com/andreafspeziale/mxm-client/issues/17)) ([89ae35e](https://github.com/andreafspeziale/mxm-client/commit/89ae35e0dd096a92d27bb2b39bbe458d2295a4fe))

## [1.1.0](https://github.com/andreafspeziale/mxm-client/compare/1.0.0...1.1.0) (2026-06-06)

### Features

* add baseUrl configuration option ([f78bf9e](https://github.com/andreafspeziale/mxm-client/commit/f78bf9e3e945af2b769b1250de74b83a09b1e43a))
* add disableStatusCodeValidation option ([e550b71](https://github.com/andreafspeziale/mxm-client/commit/e550b71900f40ab5f6deb1f48a102376876d1a5e))
* add responseSchema option via Standard Schema ([cfb76c0](https://github.com/andreafspeziale/mxm-client/commit/cfb76c0335b4136eee6ea9b8ef93ae2bd3d50b7d))
* add unsafe accessor for unvalidated responses ([574fa39](https://github.com/andreafspeziale/mxm-client/commit/574fa39579e27a864b1b9255b5a6bb2ecce90c9f))

### Refactors

* address review findings ([ead353c](https://github.com/andreafspeziale/mxm-client/commit/ead353cd77a144285dcc9f847fab5ccb66cac00a))
* address review findings (typed wrapperSchema, derive wrapper from builder) ([f6ca08f](https://github.com/andreafspeziale/mxm-client/commit/f6ca08f113dd428e3f3bc747d9c9d762573959eb))
* centralize apiKey resolution in execute method ([d2c87ac](https://github.com/andreafspeziale/mxm-client/commit/d2c87ac12c5bfb74adddc93a78fa852989d92a32))
* consolidate endpoint files into single definition module ([33e9966](https://github.com/andreafspeziale/mxm-client/commit/33e9966a3f34457d11c2b46d0cfcf3685968eb74))
* examples ([7732d4d](https://github.com/andreafspeziale/mxm-client/commit/7732d4dac05340d6b534709d3ec56b372b19426f))
* extract shared schemas and fix naming inconsistency ([4d1d0b8](https://github.com/andreafspeziale/mxm-client/commit/4d1d0b81bd2913d4ba2e2a26995aa315670f42de))
* make dataSchema required, export validateStatusCode, eliminate dead branch ([4ab64f8](https://github.com/andreafspeziale/mxm-client/commit/4ab64f8c5198bfe593fe001dd4e439ef97847db8))
* remove top-level apiKey from method signatures ([d2e50da](https://github.com/andreafspeziale/mxm-client/commit/d2e50da1d2ca24e80f15f0597540c34748939d1e))

### Bug Fixes

* remove explicit generics from responseSchema example (inference handles it) ([c3e54a2](https://github.com/andreafspeziale/mxm-client/commit/c3e54a2469d4809dcec38e1ba84693b07951ece7))
* require explicit typeof schema generic for proper type inference ([6d261ce](https://github.com/andreafspeziale/mxm-client/commit/6d261cef8d605f69b1752050740c5451555a3286))
* responseSchema accepts body-level schema with inferred output type ([b66e564](https://github.com/andreafspeziale/mxm-client/commit/b66e5647a555cc7e45ef84129dd45cda4f060095))
* update README badges to reference correct package ([6d5ba1a](https://github.com/andreafspeziale/mxm-client/commit/6d5ba1a4014028fba3bca59e97c54e7d8e01fff3))

### Miscellaneous

* add examples lockfiles ([3c3c6ab](https://github.com/andreafspeziale/mxm-client/commit/3c3c6aba0aca963570578e3ac0235534b94adb6a))
* align example schema naming with README convention ([4eeb7c9](https://github.com/andreafspeziale/mxm-client/commit/4eeb7c94816521cbf943a719badfc8c1957b22de))
* align naming conventions and comment style in examples and docs ([407a2d1](https://github.com/andreafspeziale/mxm-client/commit/407a2d103295944eaf86edf672eabfa70791662d))
* align schema export naming with Schema suffix ([dedc1d6](https://github.com/andreafspeziale/mxm-client/commit/dedc1d61aa1d6bb27adf9d244e53f3a4f4dbd36d))
* fix tgz path in js example, align naming in comments ([e584cde](https://github.com/andreafspeziale/mxm-client/commit/e584cdee02390e8fb07ca9ad738e0717e97c2f0c))
* reorder README sections (custom response schema before unsafe) ([d547c88](https://github.com/andreafspeziale/mxm-client/commit/d547c88896fa55e2a0f18e309f883367717fbfb2))
* update dependency @types/node to v24.13.0 ([#10](https://github.com/andreafspeziale/mxm-client/issues/10)) ([10fc576](https://github.com/andreafspeziale/mxm-client/commit/10fc576f99be9ed9495b52f59c0312a7caf22cad))
* update dependency tsdown to v0.22.2 ([#5](https://github.com/andreafspeziale/mxm-client/issues/5)) ([2cc1ddd](https://github.com/andreafspeziale/mxm-client/commit/2cc1ddd6cf9e26b653148d5889879236f39dc22c))
* update dependency undici to v7.27.1 ([#6](https://github.com/andreafspeziale/mxm-client/issues/6)) ([c20aa82](https://github.com/andreafspeziale/mxm-client/commit/c20aa8214998fdd417d48d389460ccd66832788b))

## 1.0.0 (2026-06-02)

### Features

* initial ([a16d025](https://github.com/andreafspeziale/mxm-client/commit/a16d02526f5ba079f3b4320f19e01656529a0ea5))
