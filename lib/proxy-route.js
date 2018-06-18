/**
 * Created by Cooper on 2018/05/29.
 */
const _ = require('lodash');
const { Router } = require('express');
const router = Router();
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({});
const { db, store } = require('./local');

let errors = {};

proxy.on('proxyReq', (proxyReq, req, res, options) => {
  if (req.body) {
    const bodyData = JSON.stringify(req.body);
    proxyReq.setHeader('Content-Type', 'application/json');
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
    proxyReq.write(bodyData);
  }
});

proxy.on('error', (err, req, res) => {
  console.log('========= err', err);
  let target = req.headers['x-target'];
  errors[target] = errors.hasOwnProperty(target) ? errors[target] + 1 : 1;
  console.log('========= errors', errors);
  if (errors[target] > 3) {
    try {
      if (req.headers['x-name'] !== 'root') {
        _.find(
          _.find(store, e => e.name === req.headers['x-name']).targets,
          e => e.url === req.headers['x-target'],
        ).status = -1;
      }
      db.set('apis', store).write();
      errors = {};
    } catch (e) {
      console.error(e);
    }
  }

  res.writeHead(500, {
    'Content-Type': 'text/plain',
  });
  res.end('internal server error'.toUpperCase());
});

let env = process.env.NODE_ENV || 'dev';

router.use('/:path?', (req, res, next) => {
  for (const api of store) {
    // console.log('========= name', api.name);
    // console.log('========= path', api.path);
    if (api.path === '/' + (req.params.path || '')) {
      if (
        env !== 'prod' ||
        (api.consumers.length === 1 && api.consumers[0] === 'All') ||
        api.consumers.includes(req.headers.apikey)
      ) {
        let item = _.sample(_.filter(api.targets, e => e.weight > 0 && e.status > 0));
        if (item) {
          const target = item.url;
          // console.log('[name]:', api.name);
          req.headers['x-name'] = api.name;
          req.headers['x-target'] = target;
          proxy.web(req, res, { target });
        } else {
          res.status(500).send('internal server error'.toUpperCase());
        }
      } else {
        res.status(500).send('apikey is required');
      }
      return;
    }
  }
  console.log('go next ..');
  next();
});

module.exports = router;
