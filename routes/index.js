const userRouter = require('./user');
const apiRouter = require('./admin');
const proxyRouter = require('./proxy');
console.log('user api proxy');
module.exports = { userRouter, apiRouter, proxyRouter };
