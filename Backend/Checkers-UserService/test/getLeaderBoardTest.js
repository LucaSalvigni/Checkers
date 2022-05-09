const { expect } = require('chai');
const api = require('./utils/api');

describe('Get leaderboard Test', async () => {
  it('should get leaderboard', async () => {
    const leaderboard = await api.getLeaderboard();
    expect(leaderboard.status).to.equal(200);
  });
});
