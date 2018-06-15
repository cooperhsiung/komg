/**
 * Created by Cooper on 2018/6/3.
 */
const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync(path.resolve(__dirname, 'db.json'));
const db = low(adapter);
const store = db
  .get('apis')
  .cloneDeep()
  .value()
  .sort((a, b) => a.order - b.order);

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

module.exports = { db, store, schema };

// default set
// db
//   .set('apis', [
//     {
//       name: 'test',
//       path: '/test678',
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
//       order: 2,
//     },
//   ])
//   .write();
