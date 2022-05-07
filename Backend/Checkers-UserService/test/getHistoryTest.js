const { expect } = require('chai');
const api = require('./utils/api');
const User = require('../models/userModel');

describe('Get history Test', async () => {
  before(async () => {
    const checkUser = await User.find({ mail: 'userok@testusers.com' });
    if (checkUser.length === 0) {
      const user = await api.createUser('userok@testusers.com', 'filippo23', '1231AAcc*');
      await api.registerUser(user);
    }
    await api.loginUser({ mail: 'userok@testusers.com', password: '1231AAcc*' });
  });
  it('should get history', async () => {
    const history = await api.getHistory('userok@testusers.com');
    // console.log(history)
    expect(history.status === 200);
  });
  it('should not get history', async () => {
    const historyFail = await api.getHistory('c@c.com');
    // console.log(historyFail)
    expect(historyFail.status === 400);
  });
});
