const app = require('../lib/server');
const server = app.listen();
const request = require('supertest').agent(server);

describe('GET /', () => {
  after(() => {
    server.close();
  });

  it('should return 200 OK', () => {
    return request.get('/').expect(200);
  });

  it('should return 200 OK', function() {
    this.timeout(1000);
    return request.get('/').expect(200);
  });
});
