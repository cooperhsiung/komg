/**
 * Created by Cooper on 2018/06/06.
 */
const faye = require('faye');
const db = require('./local').db;
const clients = [];

db.get('nodes')
  .value()
  .forEach(node => {
    let client = new faye.Client((node.includes('http') ? node : 'http://' + node) + '/admin/faye');
    console.log(node);
    clients.push(client);
  });

module.exports = clients;
