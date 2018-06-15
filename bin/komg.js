#!/usr/bin/env node
const program = require('commander');

program
  .version(require('../package.json').version)
  .option('-p, --port <p>', 'set port, default 2350')
  .option('--env <env>', 'set NODE_ENV, default dev, another option prod')
  .option('--redis <redis>', 'redis url, default redis://127.0.0.1:6379/0')
  .option('--basic-auth <basic-auth>', 'set basic auth, default none, eg:user1=password1')
  .parse(process.argv);

process.env.PORT = program.port || 2350;
process.env.NODE_ENV = program.env || 'dev';
process.env.REDIS = program.redis || 'redis://127.0.0.1:6379/0';

require('../lib/server').start({ basicAuth: program.basicAuth });
