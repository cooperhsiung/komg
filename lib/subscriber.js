/**
 * Created by Cooper on 2018/06/06.
 */
const faye = require('faye');
const cjv = require('cjv');
const db = require('./local').db;
const store = require('./local').store;
const schema = require('./local').schema;
const client = new faye.Client(`http://localhost:${process.env.PORT || 2350}/admin/faye`);

const _ = require('lodash');

client.subscribe('/save', function(body) {
  if (Array.isArray(body)) {
    for (let api of body) {
      saveOne(api);
    }
  } else {
    saveOne(body);
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

client.subscribe('/remove', function(body) {
  let { name } = body;
  db
    .get('apis')
    .remove({ name })
    .write();
  _.remove(store, e => e.name === name);
});

client.subscribe('/reload', function(body) {
  let { name } = body;
  if (body.name === 'all') {
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
});

client.subscribe('/up', function(server /*string ip:port*/) {
  console.log("======== up server",server);
  _.forEach(store, api => {
    let ts = _.filter(api.targets, target => target.url.includes(server));
    if (ts) {
      ts.forEach(e => Object.assign(e, { status: 1 }));
    }
  });
  db.set('apis', store).write();
});

client.subscribe('/down', function(server /*string ip:port*/) {
  console.log("========= down server",server);
  _.forEach(store, api => {
    let ts = _.filter(api.targets, target => target.url.includes(server));
    if (ts) {
      ts.forEach(e => Object.assign(e, { status: -1 }));
    }
  });
  db.set('apis', store).write();
});

console.log('subscriber listening ..');
module.exports = client;
