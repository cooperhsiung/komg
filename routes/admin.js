const { Router } = require('express');
const router = Router();
const _ = require('lodash');
let config = require('../load-config');
// const mongoClient = require('../services/mongo_client');

const Api = require('../services/model');

router.get('/', (req, res, next) => {
  Api.find()
    .then(ret => {
      console.log(ret);
      res.render('index', { title: 'Hey', data: ret });
    })
    .catch(err => {
      console.log(err);
    });
});

router.get('/t', (req, res, next) => {
  Api.find()
    .then(ret => {
      // console.log(ret);
      res.render('index2', { title: 'Hey', data: ret });
    })
    .catch(err => {
      console.log(err);
    });
  // mongoClient
  //   .find({}, 'gw')
  //   .then(ret => {
  //     console.log(ret);
  //     res.render('index2', { title: 'Hey', data: ret });
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });
});

router.get('/query', (req, res, next) => {
  mongoClient
    .findOne({ name: req.query.name }, 'gw')
    .then(ret => {
      res.json(ret);
    })
    .catch(err => {
      res.json(err);
    });
});

router.post('/update', (req, res, next) => {
  const name = req.body.name || req.query.name;
  Object.assign(_.find(config, e => e.name === name), req.body);
  Api.updateOne({ _id: name }, req.body, { upsert: true });
  res.send('ok');
});

router.post('/save', (req, res, next) => {
  const name = req.body.name || req.query.name;
  // Object.assign(_.find(config, e => e.name === name), req.body);
  console.log('========= req.body', req.body);

  // res.json({ msg: 'ok' });
  Api.updateOne({ _id: name }, req.body, { upsert: true })
    .then(ret => {
      res.json(ret);
    })
    .catch(err => {
      res.json(err);
    });
});

router.post('/remove', (req, res, next) => {
  const name = req.body.name || req.query.name;
  console.log(name);
  res.send('ok')
  // Object.assign(_.find(config, e => e.name === name), req.body);
  // Api.deleteOne({ _id: name })
  //   .then(ret => {
  //     res.json(ret);
  //   })
  //   .catch(err => {
  //     res.json(err);
  //   });
});

module.exports = router;
