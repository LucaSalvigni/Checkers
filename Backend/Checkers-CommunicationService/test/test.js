const { assert } = require('chai');
const api = require('./utils/api');
const User = require('../../Checkers-UserService/models/userModel');

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
let token;

describe('Communication Service Tests', async () => {
  before(async () => {
    const checkUser = await User.find({ mail: 'userok@testusers.com' });
    if (checkUser.length > 0) {
      await User.deleteMany({ mail: 'userok@testusers.com' });
    }
  });
  it('signUp should work', (done) => {
    api.registerUser(api.createUser('userok@testusers.com', 'filippo23', '1231AAcc*'));
    api.getClient().on('signup_success', (arg) => {
      assert.equal(arg.message, 'Sign up completed successfully.');
      done();
    });
  });
  it('signUp should fail', (done) => {
    api.registerUser(api.createUser('manuele.pasini@gmail', 'filippo23', '12'));
    api.getClient().on('signup_error', (arg) => {
      assert.equal(arg.message.message, 'Email not valid.');
      done();
    });
  });
  it('login should fail', (done) => {
    api.loginUser({ mail: 'userok@testusers.com', password: 'ciao' });
    api.getClient().on('login_error', (arg) => {
      assert.equal(arg.message.message, 'Authentication failed, wrong email and/or password');
      done();
    });
  });
  it('login should work', (done) => {
    api.loginUser({ mail: 'userok@testusers.com', password: '1231AAcc*' });
    api.getClient().on('login_ok', (arg) => {
      token = arg.token;
      assert.equal(arg.message, 'Authentication successfull, welcome back filippo23!');
      done();
    });
  });
  it('update should work', (done) => {
    api.updateUserProfile({ mail: 'userok@testusers.com', params: newValues }, token);
    api.getClient().on('updated_user', (arg) => {
      console.log(arg);
      done();
    });
  });
  it('update should fail', (done) => {
    api.updateUserProfile({ mail: 'userok@testusers.com', params: newWrongValues }, token);
    api.getClient().on('client_error', (arg) => {
      assert.equal(arg.message.message, "You can't change the email associated to an account.");
      done();
    });
  });
  it('update should fail for wrong token', (done) => {
    api.updateUserProfile({ mail: 'userok@testusers.com', params: newValues }, null);
    api.getClient().on('token_error', (arg) => {
      assert.equal(arg.message, 'You are not authenticated, please login again');
      done();
    });
  });
  it('getLeaderboard should work', (done) => {
    api.getLeaderboard(token);
    api.getClient().on('leaderboard', (arg) => {
      console.log(arg);
      done();
    });
  });
  /* it('getLeaderboard should fail', (done) => {
    api.getLeaderboard('');
    api.getClient().on('token_error', (arg) => {
      assert.equal(arg.message, 'You are not authenticated, please login again');
      done();
    });
  }); */
  it('getProfile should work', (done) => {
    api.getProfile(token);
    api.getClient().on('user_profile', (arg) => {
      console.log(arg);
      done();
    });
  });
  /* it('getHistory should work', (done) => {
    api.getHistory(token);
    api.getClient().on('user_profile', (arg) => {
      console.log(arg);
      done();
    });
  }); */
  /* it('login should fail', (done) => {
    api.loginUser({ mail: 'userok@testusers.com', password: 'ciao' });
    api.getClient().on('login_error', (arg) => {
      console.log(arg)
      assert.equal(arg.message, 'Someone is already logged in with such email')
      done();
    })
  }); */

  /* it("should work (with ack)", (done) => {
    serverSocket.on("hi", (cb) => {
      cb("hola");
    });
    clientSocket.emit("hi", (arg) => {
      assert.equal(arg, "hola");
      done();
    });
  }); */
});
