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

  res.writeHead(406, {
    'Content-Type': 'text/plain',
  });
  res.end('Not Acceptable'.toUpperCase());
});

let env = process.env.NODE_ENV || 'dev';

router.use('/', (req, res, next) => {
  for (const api of store) {
    // console.log('========= name', api.name);
    // console.log('========= path', api.path);
    let pat;
    if (api.path !== '/') {
      req.url = req.url.replace(api.path, '');
      pat = api.path + '(|\\/\\S*)$';
    } else {
      pat = '(|\\/\\S*)$';
    }
    // console.log('========= req.url', req.url);
    if (new RegExp(pat).test(req.originalUrl)) {
      if (
        env !== 'prod' ||
        (api.consumers.length === 1 && api.consumers[0].apikey === 'All') ||
        api.consumers.map(e => e.apikey).includes(req.headers.apikey)
      ) {
        let item = _.sample(_.filter(api.targets, e => e.weight > 0 && e.status > 0));
        if (item) {
          const target = item.url;
          console.log(req.method, req.originalUrl, '->', api.name);
          req.headers['x-name'] = api.name;
          req.headers['x-target'] = target;
          proxy.web(req, res, { target });
        } else {
          res.status(406).send('Not Acceptable'.toUpperCase());
        }
      } else {
        res.status(401).send('apikey is required');
      }
      return;
    }
  }
  console.log(req.method, req.originalUrl, '->', 'next');
  next();
});

module.exports = router;
