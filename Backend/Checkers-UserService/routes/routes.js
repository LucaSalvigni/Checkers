const router = require('express').Router();
const userController = require('../controller/userController');

console.log('Checking route');

router
// Certificate verification
  .all('*', (req, res, next) => {
    const cert = req.socket.getPeerCertificate();
    /* istanbul ignore else */
    if (req.client.authorized) {
      next();
    } else if (cert.subject) {
      res.status(403)
        .send(`Sorry ${cert.subject.CN}, can't accept certificates from ${cert.issuer.CN}.`);
    } else {
      res.status(401)
        .send('Sorry, need to provide a valid certificate.');
    }
  })
// Profile routes
  .get('/access/authenticate', userController.verify_token)
  .get('/access/refresh_token', userController.refresh_token)

  .get('/users/getLeaderboard', userController.getLeaderboard)
  .get('/profile/getProfile', userController.getProfile)
  .get('/profile/getHistory', userController.getHistory)

  .put('/profile/updateProfile', userController.updateProfile)
  .put('/profile/updatePoints', userController.updatePoints)

  .post('/access/login', userController.login)
  .post('/access/signup', userController.signup);

module.exports = router;
