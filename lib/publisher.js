/**
 * Created by Cooper on 2018/06/06.
 */
const redis = require('redis');
const client = redis.createClient(process.env.REDIS || 'redis://127.0.0.1:6379/0');
module.exports = client;
