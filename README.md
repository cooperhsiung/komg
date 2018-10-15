# komg

[![NPM Version][npm-image]][npm-url]
[![Node Version][node-image]][node-url]

A mini [kong](https://konghq.com), lightweight microservices manager.

## Admin UI

![admin](ui.png)

## Install

Firstly, [Node.js](https://nodejs.org) and [Redis](https://redis.io/) are required.

```bash
npm i -g komg
```

## Run

```bash
komg

or

komg --port=2350 --db=./db.json --env=prod --redis=redis://127.0.0.1:6379/0 --basic-auth=name1=pass1
```

then open http://localhost:2350/admin with your browser

## Argv

- -p/--port, set port for http server, default 2350
- --db, set db path, default $komg/lib/db_test.json
- --env, dev/prod, default dev(allow all requests without apikey)
- --redis, redis url
- --basic-auth, add a basic authorization for admin

## Usage

- 1.If you add a api like this

```json
{
  "name": "test",
  "path": "/test",
  "targets": [
    {
      "url": "http://localhost:3001",
      "weight": 1,
      "status": 1
    }
  ],
  "consumers": [
    {
      "apikey": "All",
      "status": 1
    }
  ],
  "order": 1
}
```

your requests to `http://localhost:2350/test` will be proxied to `http://localhost:3001`

- 2.If you add a api like this

```json
{
  "name": "test2",
  "path": "/test2",
  "targets": [
    {
      "url": "http://localhost:3002",
      "weight": 1,
      "status": 1
    }
  ],
  "consumers": [
    {
      "apikey": "adsf1324asdfg",
      "status": 1
    }
  ],
  "order": 1
}
```

your requests to `http://localhost:2350/test2` will be asked an apikey in the headers, like this headers:{Content-Type:'application/json',apikey:'adsf1324asdfg'}

## Scalable

If you install komg on server A,server B, your changes on A will be synchronized to B since a subscriber running on each komg, and you just need to press the refresh button to update upstream configs in the memory.

## License

MIT

[npm-image]: https://img.shields.io/npm/v/komg.svg
[npm-url]: https://www.npmjs.com/package/komg
[node-image]: https://img.shields.io/badge/node.js-%3E=7-brightgreen.svg
[node-url]: https://nodejs.org/download/
