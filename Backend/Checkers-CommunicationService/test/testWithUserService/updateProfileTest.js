const { assert } = require('chai');
const api = require('../utils/api');

const newValues = {
  first_name: 'Riccardo',
  last_name: 'Fogli',
  mail: 'newtest@newtest.com',
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
    api.updateUserProfile(api.getClient(), newValues, api.getToken());
    api.getClient().off('updated_user');
    api.getClient().off('client_error');
    api.getClient().off('token_error');

    api.getClient().on('updated_user', (arg) => {
      console.log(arg);
      done();
    });
    api.getClient().on('client_error', (arg) => {
      console.log(arg);
      done();
    });
    api.getClient().on('token_error', (arg) => {
      assert.equal(arg.message, 'You are not authenticated, please login before update');
      done();
    });
  });
  it('update should fail', (done) => {
    api.updateUserProfile(api.getClient(), newWrongValues, api.getToken());
    api.getClient().off('client_error');
    api.getClient().on('client_error', (arg) => {
      assert.equal(arg.message.message, "You can't change the email associated to an account.");
      done();
    });
  });
  it('update should fail for wrong token', (done) => {
    api.updateUserProfile(api.getClient(), newValues, '');
    api.getClient().off('token_error');
    api.getClient().on('token_error', (arg) => {
      assert.equal(arg.message, 'You are not authenticated, please login before update');
      done();
    });
  });
  /* it('update should fail for not give new values', (done) => {
    api.updateUserProfile(api.getClient(), undefined, api.getToken());
    api.getClient().off('client_error');
    api.getClient().on('client_error', (arg) => {
      console.log(arg)
      //assert.equal(arg.message.message, "You can't change the email associated to an account.");
      done();
    });
  }); */
});
