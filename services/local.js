/**
 * Created by Cooper on 2018/6/3.
 */
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
const adapter = new FileSync(path.resolve(__dirname, 'db.json'));
const db = low(adapter);

let store = db.get('komg').value();

module.exports.store = store;
module.exports.db = db;

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
