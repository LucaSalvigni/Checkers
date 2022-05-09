const { expect } = require('chai');
const api = require('./utils/api');

describe('Get history Test', async () => {
  it('should get history', async () => {
    const history = await api.getHistory('userok@testusers.com');
    // console.log(history)
    expect(history.status).to.equal(200);
  });
  it('should not get history', async () => {
    const historyFail = await api.getHistory('c@c.com');
    // console.log(historyFail)
    expect(historyFail.status).to.equal(400);
  });
});
