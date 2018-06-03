/**
 * Created by Cooper on 2018/05/29.
 */
let c2 = [
  {
    name: 'root',
    url: '/',
    targets: [{ address: 'http://127.0.0.1:2347', weight: 1 }, { address: 'http://127.0.0.2:2347', weight: 1 }],
    consumers: ['All'],
    order: 0,
  }
];

const onChange = require('on-change');

onc2 = onChange(c2, () => {
  // console.log('========= change');
  // console.log(require('util').inspect(c2, false, null));
  // 发布消息 同步给另一节点
});

module.exports = onc2;
