const { Router } = require('express');
const router = Router();
const _ = require('lodash');
let { store, db, schema } = require('../services/local');
const cjv = require('cjv');
console.log('========= init store\n', store);

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
    const { name } = req.body;
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
    res.json({ code: 0, msg: 'ok' });
  } catch (e) {
    res.status(e.status || 500).send(e.message || e);
  }
});

router.post('/reload', (req, res, next) => {
  try {
    const name = req.query.name || req.body.name;
    if (name === 'all') {
      store = db.value();
    } else {
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
