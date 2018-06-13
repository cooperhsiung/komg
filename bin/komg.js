#!/usr/bin/env node
const program = require('commander');
const db = require('../lib/local').db;

program
  .version(require('../package.json').version)
  .option('-p, --port <p>', 'set port, default 2350')
  .option('--nodes <nodes>', 'set nodes, default localhost:2350, eg:172.0.0.1:2350,172.0.0.2:2350')
  .option('--basic-auth <basic-auth>', 'set basic auth, default none, eg:user1=password1')
  .parse(process.argv);

const port = (process.env.PORT = program.port || 2350);
const nodes = program.nodes ? program.nodes.split(',') : ['localhost:' + port];
const basicAuth = program.basicAuth;

db.set('nodes', nodes).write();
require('../lib/server').start({ port, basicAuth });
