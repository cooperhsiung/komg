const { Router } = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');
const marked = require('marked');

router.get('/', (req, res, next) => {
  res.send('hello world');
});

router.get('/add', (req, res, next) => {
  res.send('user add');
});

router.get('/doc', (req, res, next) => {
  fs.readFile(path.resolve(__dirname, '../README.md'), 'utf-8', (err, data) => {
    if (err) {
      res.send(err.message);
    } else {
      res.send(
        '<link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous"><style>table{border-collapse: collapse;}table, th, td {border: 1px solid #bbb;padding: 3px}</style><body style="margin:50px 80px 50px 80px">' +
          marked(data) +
          '</body>',
      );
    }
  });
});

module.exports = router;
