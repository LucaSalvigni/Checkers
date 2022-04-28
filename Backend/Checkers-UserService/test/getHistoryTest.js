const api = require('./utils/api');

describe('Get history Test', async () => {
  it('should get history', async () => {
    const history = await api.getHistory('ciao@ciao.com');
    if (history.status === 200) {
      history.should.have.status(200);
    } else {
      history.should.have.status(500);
    }
  });
  it('should not get history', async () => {
    const profile = await api.getHistory('c@c.com');
    profile.should.have.status(400);
  });
});
