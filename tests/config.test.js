const { db } = require('../config');
const expect = require('chai').expect;

describe('MainTest', () => {
  it('PartTest1', () => {
    expect(db).to.equal('dev');
  });

  it('PartTest2', () => {
    expect(!1).to.equal(false);
  });
});
