module.exports = {
  apps: [
    {
      name: 'komg-2350',
      script: './app.js',
      watch: false,
      env: {
        NODE_ENV: 'dev',
      },
      env_test: {
        NODE_ENV: 'test',
      },
      env_prod: {
        NODE_ENV: 'prod',
      },
    },
  ],
};
