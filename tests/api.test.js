const app = require('../app');
const supertest = require('supertest');

describe('GET /api', () => {
  it('should return 200 OK', () => {
    return supertest(app)
      .get('/api')
      .expect(200);
  });
});
