const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { createServer } = require('http');

const faye = require('faye');
const bayeux = new faye.NodeAdapter({ mount: '/admin/faye' });

const adminRouter = require('./routes/admin');
const proxyRouter = require('./routes/proxy');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
  console.log(req.url);
  next();
});

// app.use('/', userRouter);
app.use('/admin', adminRouter);
app.use('/', proxyRouter);

const server = createServer(app);
bayeux.attach(server);
const port = process.env.PORT || 2350;
if (!module.parent) server.listen(port);

server.on('error', err => {
  console.error(err);
});

server.on('listening', () => {
  console.log(`env:${process.env.NODE_ENV},listening on ${port} ..`);
});

require('./services/sub_client');
module.exports = server;
