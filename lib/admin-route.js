const { Router } = require('express');
const router = Router();
const cjv = require('cjv');
const _ = require('lodash');
const parseUrl = require('url').parse;
const { store, db, schema } = require('./local');
const render = require('pug').compileFile(require('path').resolve(__dirname, 'admin.pug'));

const subClient = require('./subscriber');
const pubClients = require('./publisher');


router.get('/', (req, res, next) => {
  try {
    let nodes = db.get('nodes').value();
    nodes = nodes.map(node => parseUrl(node).host).reduce((s, e) => (s === '' ? e : s + ', ' + e), '');
    res.write(
      render({
        nodes,
        data: db
          .get('apis')
          .value()
          .sort((a, b) => a.order - b.order),
      }),
    );
    res.end();
  } catch (e) {
    res.status(e.status || 500).send(e.message || e);
  }
});

router.get('/query', (req, res, next) => {
  try {
    const { name } = req.query;
    res.json(
      db
        .get('apis')
        .find({ name })
        .value(),
    );
  } catch (e) {
    res.status(e.status || 500).send(e.message || e);
  }
});

router.post('/save', (req, res, next) => {
  try {
    pubClients.forEach(client => {
      client.publish('/save', req.body);
    });
    console.log('========= save\n', store);
    res.json({ code: 0, msg: 'ok' });
  } catch (e) {
    res.status(e.status || 500).send(e.message || e);
  }
});

router.post('/reload', (req, res, next) => {
  try {
    pubClients.forEach(client => {
      client.publish('/reload', req.body);
    });
    res.json({ code: 0, msg: 'ok' });
  } catch (e) {
    res.status(e.status || 500).send(e.message || e);
  }
});

router.post('/remove', (req, res, next) => {
  try {
    pubClients.forEach(client => {
      client.publish('/remove', req.body);
    });
    res.json({ code: 0, msg: 'ok' });
  } catch (e) {
    res.status(e.status || 500).send(e.message || e);
  }
});

module.exports = router;
