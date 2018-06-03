/**
 * Created by Cooper on 2018/5/30.
 */

const _ = require('lodash');

let arr = [{ a: 1, name: 'a', h: [{ sleep: 1, run: 0 }] }, { b: 1, name: 'b', h: [{ sleep: 1, run: 1 }] }];

console.log(arr);

try {
  _.find(_.find(arr, e => e.b === 'c').h, e => e.sleep === 1).run = 1;
} catch (e) {}

console.log(_.sample([]));

_.find(arr, e => e.name === 'a').a = 'asd';

console.log(arr);

// console.log(require('util').inspect(arr, false, null));

// _.chain(arr).find(e=>e.name==='a').value().find(e=>e.sleep===1).value().run=2

// console.log(arr);

console.log(/^http(s|):\/\/\S+/.test('http://localhost:3002'));

console.log(/^\/\S/.test('//localhost:3002'));

console.log(/[1|0|\-1]/.test(0));
