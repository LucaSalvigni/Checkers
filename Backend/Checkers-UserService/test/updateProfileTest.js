const { expect } = require('chai');
const api = require('./utils/api');

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
  it('should update profile', async () => {
    const updatedUser = await api.updateUserProfile('userok@testusers.com', newValues);
    console.log(updatedUser);
    if (updatedUser.status === 200) {
      expect(updatedUser.status).to.equal(200);
    } else {
      expect(updatedUser.status).to.equal(400);
    }
  });
  it('should not update profile mail', async () => {
    const updatedUser = await api.updateUserProfile('userok@testusers.com', newWrongValues);
    expect(updatedUser.status).to.equal(400);
  });
  it('should not update unexisting profile', async () => {
    const updatedUser = await api.updateUserProfile('new_mail@gmail.com', newWrongValues);
    expect(updatedUser.status).to.equal(400);
  });
  it('should not update without values', async () => {
    const updatedUser = await api.updateUserProfile('new_mail@gmail.com');
    expect(updatedUser.status).to.equal(400);
  });
});
