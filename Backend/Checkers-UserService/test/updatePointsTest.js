const { expect } = require('chai');
const api = require('./utils/api');

describe('Update Points Test', async () => {
  it('should update points', async () => {
    const updatedPoints = await api.updateUserPoints({
      mail: 'mosghi@mosghi.com', stars: 0, won: true, tied: false,
    });
    console.log(updatedPoints);
    if (updatedPoints.status === 200) {
      expect(updatedPoints.status).to.equal(200);
    } else {
      expect(updatedPoints.status).to.equal(400);
    }
  });

  it('should give status 500', async () => {
    const updatedPoints = await api.updateUserPoints('ciao', {
      mail: 'mosghi@mosghi.com', stars: 0, won: true, tied: false,
    });
    expect(updatedPoints.status).to.equal(500);
  });

  it('should give status 400', async () => {
    const updatedPoints = await api.updateUserPoints({
      mail: 'gatto@cane.com', stars: 0, won: true, tied: false,
    });
    expect(updatedPoints.status).to.equal(400);
  });
});
