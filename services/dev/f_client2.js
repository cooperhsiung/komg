/**
 * Created by Cooper on 2018/06/06.
 */

const faye = require('faye');
var client = new faye.Client('http://localhost:2350/admin/faye');

client.publish('/messages', {
  text: 'Hello world'
});