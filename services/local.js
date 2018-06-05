/**
 * Created by Cooper on 2018/6/3.
 */
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
const adapter = new FileSync(path.resolve(__dirname, 'db.json'));
const db = low(adapter).get('komg');
let store = db.value();

const schema = {
  name: { type: 'string' },
  path: { type: 'string', validate: v => /^\/\S/.test(v) },
  consumers: [
    {
      apikey: { type: 'string' },
      status: { type: 'number', validate: v => /^(-|)[1|0]$/.test(v) },
    },
  ],
  targets: [
    {
      url: { type: 'string', validate: v => /^http(s|):\/\/\S+/.test(v) },
      weight: { type: 'number' },
      status: { type: 'number', validate: v => /^(-|)[1|0]$/.test(v) },
    },
  ],
  order: { type: 'number' },
};

module.exports.store = store;
module.exports.db = db;
module.exports.schema = schema;

// default set
// db
//   .set('komg', [
//     {
//       _id: 'test',
//       order: 2,
//       consumers: [
//         {
//           apikey: 'adfgdfgdfgdfgdfg',
//           status: 1,
//         },
//       ],
//       targets: [
//         {
//           url: 'http://localhost:3002',
//           weight: 1,
//           status: 1,
//         },
//         {
//           url: 'http://localhost:3002',
//           weight: 1,
//           status: 1,
//         },
//       ],
//       path: '/test678',
//       name: 'test',
//     },
//   ])
//   .write();
