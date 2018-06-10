/**
 * Created by Cooper on 2018/06/06.
 */
const faye = require('faye');
const db = require('./local').db;
const client = new faye.Client(`http://localhost:${process.env.PORT || 2350}/admin/faye`);

client.subscribe('/save', function(message) {
  // console.log('========= message', message);
  db.set('apis', message).write();
});

console.log('subscribe ..');
module.exports = client;
