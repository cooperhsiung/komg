/**
 * Created by Cooper on 2018/06/06.
 */
const faye = require('faye');
const nodes = require('./local').nodes;
const clients = [];

nodes.forEach(node => {
  let client = new faye.Client(node + '/admin/faye');
  console.log(node);
  clients.push(client);
});

module.exports = clients;
