global.env = process.env.NODE_ENV || 'dev';
const config = {
  db: {
    prod: 'prod',
    test: 'test',
    dev: 'dev',
  }
};

module.exports = new Proxy(config, { get: (target, name) => target[name][env] });
