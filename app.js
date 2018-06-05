const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createServer } = require('http');
const { adminRouter, proxyRouter } = require('./routes');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV !== 'prod') {
  app.use(cors());
}

app.use((req, res, next) => {
  console.log(req.url);
  next();
});

// app.use('/', userRouter);
app.use('/admin', adminRouter);
app.use('/', proxyRouter);

const server = createServer(app);
const port = process.env.PORT || 2350;
if (!module.parent) server.listen(port);

server.on('error', err => {
  console.error(err);
});

server.on('listening', () => {
  console.log(`env:${process.env.NODE_ENV},listening on ${port} ..`);
});

module.exports = server;
