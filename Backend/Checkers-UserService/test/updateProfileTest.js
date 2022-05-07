const { expect } = require('chai');
const api = require('./utils/api');
const User = require('../models/userModel');

const newValues = {
  first_name: 'Riccardo',
  last_name: 'Fogli',
  mail: 'userok@testusers.com',
  username: 'pippo23',
  avatar: '',
};
const newWrongValues = {
  first_name: 'Riccardo',
  last_name: 'Fogli',
  mail: 'new_mail@gmail.com',
  username: 'ricky23',
  avatar: '',
};

describe('Update profile Test', async () => {
  before(async () => {
    const checkUser = await User.find({ mail: 'userok@testusers.com' });
    if (checkUser.length === 0) {
      const newUser = await api.createUser('userok@testusers.com', 'filippo23', '1231AAcc*');
      await api.registerUser(newUser);
    }
  });
  it('should update profile', async () => {
    const updatedUser = await api.updateUserProfile('userok@testusers.com', newValues);
    expect(updatedUser.status === 200);
  });
  it('should not update profile mail', async () => {
    const updatedUser = await api.updateUserProfile('userok@testusers.com', newWrongValues);
    expect(updatedUser.status === 400);
  });
  it('should not update unexisting profile', async () => {
    const updatedUser = await api.updateUserProfile('new_mail@gmail.com', newWrongValues);
    expect(updatedUser.status === 400);
  });
  it('should not update without values', async () => {
    const updatedUser = await api.updateUserProfile('new_mail@gmail.com');
    expect(updatedUser.status === 400);
  });
});
