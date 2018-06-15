/**
 * Created by Cooper on 2018/06/06.
 */
const cjv = require('cjv');
const _ = require('lodash');
const redis = require('redis');
const db = require('./local').db;
const store = require('./local').store;
const schema = require('./local').schema;

const client = redis.createClient(process.env.REDIS || 'redis://127.0.0.1:6379/0');
client.subscribe('komg/save');
client.subscribe('komg/reload');
client.subscribe('komg/remove');
client.subscribe('komg/up');
client.subscribe('komg/down');

client.on('message', function(channel, message) {
  console.log('========= channel', channel);
  console.log('========= message', message);
  let json = {};
  try {
    json = JSON.parse(message);
  } catch (e) {
    console.error(e);
    return;
  }

  if (channel === 'komg/save') {
    if (Array.isArray(json)) {
      for (let api of json) {
        saveOne(api);
      }
    } else {
      saveOne(json);
    }
  }

  if (channel === 'komg/reload') {
    let { name } = json;
    if (json.name === 'all') {
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
    // console.log('========= store\n', store);
    console.log(require('util').inspect(store, false, null));
  }

  if (channel === 'komg/remove') {
    let { name } = json;
    db
      .get('apis')
      .remove({ name })
      .write();
    _.remove(store, e => e.name === name);
  }

  if (channel === 'komg/up') {
    _.forEach(store, api => {
      let ts = _.filter(api.targets, target => target.url.includes(json.server));
      if (ts) {
        ts.forEach(e => Object.assign(e, { status: 1 }));
      }
    });
    db.set('apis', store).write();
  }

  if (channel === 'komg/down') {
    _.forEach(store, api => {
      let ts = _.filter(api.targets, target => target.url.includes(json.server));
      console.log('========= ts', ts);
      if (ts) {
        ts.forEach(e => Object.assign(e, { status: -1 }));
      }
    });
    db.set('apis', store).write();
  }
});

function saveOne(api) {
  try {
    cjv(schema, api);
    let raw = db
      .get('apis')
      .find({ name: api.name })
      .value();
    if (raw) {
      db
        .get('apis')
        .find({ name: api.name })
        .assign(api)
        .write();
    } else {
      db
        .get('apis')
        .push(api)
        .write();
    }
  } catch (e) {
    console.error(e);
  }
}

console.log('subscriber listening ..');
