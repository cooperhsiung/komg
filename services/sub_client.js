/**
 * Created by Cooper on 2018/06/06.
 */
const faye = require('faye');
const client = new faye.Client('http://localhost:2350/admin/faye');
const low = require('./local').low;

client.subscribe('/save', function(message) {
  console.log('========= message', message);
  low.set('apis', message).write();
});

console.log('subscribe..');
module.exports = client;
