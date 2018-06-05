/**
 * Created by Cooper on 2018/06/05.
 */

const cjv = require('cjv');

let testData = (module.exports = [
  {
    path: '/test3',
    name: 'test',
    consumers: [
      {
        apikey: '11111',
        status: -1,
      },
    ],
    targets: [
      {
        url: 'https://localhost:3002',
        weight: 1,
        status: 1,
      },
      {
        url: 'http://localhost:3002',
        weight: 1,
        status: 1,
      },
    ],
    order: 2,
  },
  {
    name: 'test2',
    path: '/test3',
    targets: [
      {
        url: 'https://localhost:3002',
        weight: 1,
        status: 1,
      },
      {
        url: 'http://localhost:3002',
        weight: 1,
        status: 1,
      },
    ],
    consumers: [
      {
        apikey: '11111',
        status: 1,
      },
    ],
    order: 2,
  },
]);

const schema = require('../local').schema;

testData.forEach(e => {
  console.log(cjv(schema, e));
});

// console.log(testData);
