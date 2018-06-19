const path = require('path');
const express = require('express');
const auth = require('basic-auth');
const bodyParser = require('body-parser');
const { createServer } = require('http');

const adminRouter = require('./admin-route');
const proxyRouter = require('./proxy-route');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//   console.log(req.method + ' ' + req.url);
//   next();
// });

function start(argv = {}) {
  console.log('[argv]:', argv);
  app.use('/admin', applyAuth(argv.basicAuth), adminRouter);
  app.use('/', proxyRouter);
  const server = createServer(app);
  const port = process.env.PORT || 2350;
  server.listen(port);
  server.on('error', err => {
    console.error(err);
  });

  server.on('listening', () => {
    console.log(
      '[process.env]:',
      `{PORT:${process.env.PORT},DB:${process.env.DB},REDIS:${process.env.REDIS},NODE_ENV:${process.env.NODE_ENV}}`,
    );
    console.log(`listening on ${port} ..`);
  });

  require('./subscriber');
}

function applyAuth(basicAuth) {
  return function(req, res, next) {
    if (!basicAuth) {
      return next();
    }
    if (req.method === 'OPTIONS') {
      return next();
    }
    let [name, pass] = basicAuth.split('=');
    if (!name || !pass) {
      throw new Error('basic auth format error');
    }
    const credentials = auth(req);
    if (!credentials || credentials.name !== name || credentials.pass !== pass) {
      res.statusCode = 401;
      res.setHeader('WWW-Authenticate', 'Basic realm="example"');
      res.end('Access denied');
    } else {
      next();
    }
  };
}

if (!module.parent) start();

module.exports = { start };
