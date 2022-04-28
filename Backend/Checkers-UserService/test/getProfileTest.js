const api = require('./utils/api');

describe('Get profile Test', () => {
  it('should get profile', async () => {
    const profile = await api.getProfile('ciao@ciao.com');
    if (profile.status === 200) {
      profile.should.have.status(200);
    } else {
      profile.should.have.status(500);
    }
  });
  it('should not get profile', async () => {
    const profile = await api.getProfile('c@c.com');
    profile.should.have.status(400);
  });
});
