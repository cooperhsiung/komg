const { Router } = require('express');
const router = Router();
const cjv = require('cjv');
const _ = require('lodash');
const parseUrl = require('url').parse;
const { store, db, schema } = require('./local');
const render = require('pug').compileFile(require('path').resolve(__dirname, 'admin.pug'));

const subClient = require('./subscriber');
const pubClients = require('./publisher');

subClient.subscribe('/reload', function() {
  let data = db
    .get('apis')
    .cloneDeep()
    .value()
    .sort((a, b) => a.order - b.order);

  store.splice(0, data.length);

  data.forEach(e => store.push(e));
  // store =
  console.log('========= store\n', store);
});

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
    const name = req.query.name || req.body.name;
    if (name === 'all') {
      // console.log('========= req.body', req.body);
      for (let api of req.body) {
        cjv(schema, api);
      }
      pubClients.forEach(client => {
        client.publish('/save', req.body);
      });
    } else {
      cjv(schema, req.body);
      let api = db
        .get('apis')
        .find({ name })
        .value();
      if (api) {
        db
          .get('apis')
          .find({ name })
          .assign(req.body)
          .write();
      } else {
        db
          .get('apis')
          .push(req.body)
          .write();
      }
    }
    console.log('========= save\n', store);
    res.json({ code: 0, msg: 'ok' });
  } catch (e) {
    res.status(e.status || 500).send(e.message || e);
  }
});

router.post('/reload', (req, res, next) => {
  try {
    const name = req.query.name || req.body.name;
    if (name === 'all') {
      // store = db.get('apis').value();
      pubClients.forEach(client => {
        client.publish('/reload', {
          text: 'hello reload',
        });
      });
    } else {
      console.log('========= value()', db.get('apis').value());
      let api = db
        .get('apis')
        .find({ name })
        .value();
      const exist = _.find(store, e => e.name === name);
      if (exist) {
        Object.assign(exist, api || {});
      } else if (api) {
        store.push(api);
      }
    }
    store.sort((a, b) => a.order - b.order);
    console.log('========= store\n', store);
    res.json({ code: 0, msg: 'ok' });
  } catch (e) {
    res.status(e.status || 500).send(e.message || e);
  }
});

router.post('/remove', (req, res, next) => {
  try {
    let { name } = req.body;
    db
      .get('apis')
      .remove({ name })
      .write();
    _.remove(store, e => e.name === name);
    // console.log('========= store', store);
    res.json({ code: 0, msg: 'ok' });
  } catch (e) {
    res.status(e.status || 500).send(e.message || e);
  }
});

module.exports = router;
