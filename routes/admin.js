const { Router } = require('express');
const router = Router();
const _ = require('lodash');
let { store, db, schema } = require('../services/local');
const cjv = require('cjv');
console.log('========= init store\n', store);

const pubClients = require('../services/pub_client');
const subClient = require('../services/sub_client');

subClient.subscribe('/reload', function() {
  store = low.get('apis').value();
  console.log('========= store', store);
});

console.log('subscribe..');

router.get('/', (req, res, next) => {
  try {
    res.render('index', { title: 'Hey', data: store });
  } catch (e) {
    res.status(e.status || 500).send(e.message || e);
  }
});

router.get('/query', (req, res, next) => {
  try {
    const { name } = req.query;
    res.json(db.find({ name }).value());
  } catch (e) {
    res.status(e.status || 500).send(e.message || e);
  }
});

router.post('/save', (req, res, next) => {
  try {
    const name = req.query.name || req.body.name;
    if (name === 'all') {
      console.log('========= req.body', req.body);
      for (let api of req.body) {
        cjv(schema, api);
      }
      pubClients.forEach(client => {
        client.publish('/save', req.body);
      });
    } else {
      cjv(schema, req.body);
      let api = db.find({ name }).value();
      if (api) {
        db
          .find({ name })
          .assign(req.body)
          .write();
      } else {
        db.push(req.body).write();
      }
    }
    res.json({ code: 0, msg: 'ok' });
  } catch (e) {
    res.status(e.status || 500).send(e.message || e);
  }
});

router.post('/reload', (req, res, next) => {
  try {
    const name = req.query.name || req.body.name;
    if (name === 'all') {
      // store = db.value();
      pubClients.forEach(client => {
        client.publish('/reload', {
          text: 'hello reload',
        });
      });
    } else {
      console.log('========= db.value()', db.value());
      let api = db.find({ name }).value();
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
    db.remove({ name }).write();
    _.remove(store, e => e.name === name);
    // console.log('========= store', store);
    res.json({ code: 0, msg: 'ok' });
  } catch (e) {
    res.status(e.status || 500).send(e.message || e);
  }
});

module.exports = router;
