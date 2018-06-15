const { Router } = require('express');
const router = Router();
const db = require('./local').db;
const render = require('pug').compileFile(require('path').resolve(__dirname, 'admin.pug'));
const nifs = Object.values(require('os').networkInterfaces());
const address = nifs.reduce((s, v) => s.concat(v), []).find(e => e.family === 'IPv4' && !e.internal).address;
const publisher = require('./publisher');

router.get('/', (req, res, next) => {
  try {
    const node = address + ':' + (process.env.PORT || 2350);
    res.write(
      render({
        node,
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
    publisher.publish('komg/save', JSON.stringify(req.body));
    res.json({ code: 0, msg: 'ok' });
  } catch (e) {
    res.status(e.status || 500).send(e.message || e);
  }
});

router.post('/reload', (req, res, next) => {
  try {
    publisher.publish('komg/reload', JSON.stringify(req.body));
    res.json({ code: 0, msg: 'ok' });
  } catch (e) {
    res.status(e.status || 500).send(e.message || e);
  }
});

router.post('/remove', (req, res, next) => {
  try {
    publisher.publish('komg/remove', JSON.stringify(req.body));
    res.json({ code: 0, msg: 'ok' });
  } catch (e) {
    res.status(e.status || 500).send(e.message || e);
  }
});

module.exports = router;
