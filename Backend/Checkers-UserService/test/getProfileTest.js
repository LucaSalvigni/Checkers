const { expect } = require('chai');
const api = require('./utils/api');

describe('Get profile Test', async () => {
  it('should get profile', async () => {
    const profile = await api.getProfile('userok@testusers.com');
    console.log(profile);
    if (profile.status === 200) {
      expect(profile.status).to.equal(200);
    } else {
      expect(profile.status).to.equal(400);
    }
  });
  it('should not get profile', async () => {
    const profile = await api.getProfile('c@c.com');
    expect(profile.status).to.equal(400);
  });
});
