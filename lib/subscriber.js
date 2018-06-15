/**
 * Created by Cooper on 2018/06/06.
 */
const cjv = require('cjv');
const _ = require('lodash');
const redis = require('redis');
const { db, store, schema } = require('./local');

const client = redis.createClient(process.env.REDIS || 'redis://127.0.0.1:6379/0');
['komg/save', 'komg/reload', 'komg/remove', 'komg/up', 'komg/down'].forEach(chan => client.subscribe(chan));

client.on('message', function(chan, msg) {
  console.log('========= chan', chan);
  console.log('========= msg', msg);
  try {
    msg = JSON.parse(msg);
  } catch (e) {
    console.error(e);
    return;
  }

  if (chan === 'komg/save') {
    if (Array.isArray(msg)) {
      for (let api of msg) {
        upsert(api);
      }
    } else {
      upsert(msg);
    }
  }

  if (chan === 'komg/reload') {
    let { name } = msg;
    if (name === 'all') {
      let data = db
        .get('apis')
        .cloneDeep()
        .value()
        .sort((a, b) => a.order - b.order);

      data.forEach(e => {
        const exist = _.find(store, v => v.name === e.name);
        if (exist) {
          Object.assign(exist, e);
        } else if (e) {
          store.push(e);
        }
      });
    } else {
      const api = db
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
    // console.log('========= store\n', store);
    // console.log(require('util').inspect(store, false, null));
  }

  if (chan === 'komg/remove') {
    let { name } = msg;
    db.get('apis')
      .remove({ name })
      .write();
    _.remove(store, e => e.name === name);
  }

  if (chan === 'komg/up') {
    _.forEach(store, api => {
      const targets = _.filter(api.targets, target => target.url.includes(msg.server));
      if (targets) {
        targets.forEach(e => Object.assign(e, { status: 1 }));
      }
    });
    db.set('apis', store).write();
  }

  if (chan === 'komg/down') {
    _.forEach(store, api => {
      const targets = _.filter(api.targets, target => target.url.includes(msg.server));
      if (targets) {
        targets.forEach(e => Object.assign(e, { status: -1 }));
      }
    });
    db.set('apis', store).write();
  }
});

function upsert(api) {
  try {
    cjv(schema, api);
    const apis = db
      .get('apis')
      .find({ name: api.name })
      .value();
    if (apis) {
      db.get('apis')
        .find({ name: api.name })
        .assign(api)
        .write();
    } else {
      db.get('apis')
        .push(api)
        .write();
    }
  } catch (e) {
    console.error(e);
  }
}

console.log('subscriber listening ..');
