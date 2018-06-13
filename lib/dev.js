/**
 * Created by Cooper on 2018/6/13.
 */

const _ = require('lodash');

const l = [{ a: 1, b: [{ c: 1 }, { d: 2 }] }, { a: 5, b: [{ c: 5 }, { d: 5 }] }, { a: 11, b: [{ c: 11 }, { d: 22 }] }];



// _.forEach(l,e=>{
//   _.find(e)
// });

// let a = _.chain(l).forEach(e=>e.b).find(v=>v.c>2).assign({d:1}).value();
// console.log(require('util').inspect(l, false, null));
// console.log(a);

_.forEach(l, api => {
  let ts = _.filter(api.b, b => b.c>2);
  if (ts) {
    ts.forEach(e=>Object.assign(e, { status: 1 }))
  }
});

console.log(require('util').inspect(l, false, null));