const { Router } = require('express');
const router = Router();
const _ = require('lodash');
const Api = require('../services/model');
let store = require('../services/local').store;

console.log('===', store, '====');

router.get('/', (req, res, next) => {
  (async () => {
    let ret = await Api.find();
    res.render('index', { title: 'Hey', data: ret });
  })().catch(err => {
    res.json(err);
  });
});

router.get('/query', (req, res, next) => {
  (async () => {
    if (typeof store.then === 'function') {
      console.log('========= await');
      store = await store;
    }
    res.send(store);
  })().catch(err => {
    res.json(err);
  });
});

router.post('/save', (req, res, next) => {
  (async () => {
    let api = await Api.findOne({ _id: req.body.name });
    let ret;
    if (!api) {
      ret = await Api.create(Object.assign({ _id: req.body.name }, req.body));
    } else {
      merge(api, req.body);
    }
    ret = await api.save();
    res.json(ret);
  })().catch(err => {
    res.json(err);
  });
  // for validation when upsert
  function merge(api, body) {
    api.name = body.name;
    api.path = body.path;
    api.targets = body.targets;
    api.consumers = body.consumers;
    api.order = body.order;
  }
});

router.post('/reload', (req, res, next) => {
  (async () => {
    const name = req.query.name || req.body.name;
    if (name === 'all') {
      store = await Api.find();
    } else {
      const api = await Api.findOne({ _id: req.body.name });
      const exist = _.find(store, e => e.name === req.body.name);
      if (exist) {
        Object.assign(exist, api || {});
      } else if (api) {
        store.push(api);
      }
    }
    console.log('========= store', store);
    res.send('ok');
  })().catch(err => {
    res.json({ msg: err.message || err });
  });
});

router.post('/remove', (req, res, next) => {
  (async () => {
    let api = await Api.findOne({ _id: req.body.name });
    if (api) {
      api.remove();
    }
    _.remove(store, e => e.name === req.body.name);
    console.log('========= store', store);
    res.json('ok');
  })().catch(err => {
    res.json(err);
  });
});

module.exports = router;
