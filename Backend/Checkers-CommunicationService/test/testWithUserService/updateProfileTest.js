const { assert } = require('chai');
const api = require('../utils/api');

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

describe('Communication Service Update Tests', async () => {
  it('update should work', (done) => {
    api.updateUserProfile(api.getClient(), { mail: 'userok@testusers.com', params: newValues }, api.getToken());
    api.getClient().on('updated_user', (arg) => {
      console.log(arg);
      done();
    });
  });
  it('update should fail', (done) => {
    api.updateUserProfile(api.getClient(), { mail: 'userok@testusers.com', params: newWrongValues }, api.getToken());
    api.getClient().on('client_error', (arg) => {
      assert.equal(arg.message.message, "You can't change the email associated to an account.");
      done();
    });
  });
  it('update should fail for wrong token', (done) => {
    api.updateUserProfile(api.getClient2(), { mail: 'userok@testusers.com', params: newValues }, '');
    api.getClient2().on('token_error', (arg) => {
      assert.equal(arg.message, 'You are not authenticated, please login before update');
      done();
    });
  });
});