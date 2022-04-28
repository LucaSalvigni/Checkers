const api = require('./utils/api');

describe('Get leaderboard Test', async () => {
  it('should get leaderboard', async () => {
    const leaderboard = await api.getLeaderboard();
    leaderboard.should.have.status(200);
  });
});
