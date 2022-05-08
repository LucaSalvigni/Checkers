const express = require('express');

const router = express.Router();
const userController = require('../controller/userController');

router
// Certificate verification
  .all('*', (req, res, next) => {
    console.log('Checking certificate')
    const cert = req.socket.getPeerCertificate();
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
  .get('/authenticate', userController.verify_token)
  .get('/refresh_token', userController.refresh_token)

  .get('/getLeaderboard', userController.getLeaderboard)
  .get('/profile/getProfile', userController.getProfile)
  .get('/profile/getHistory', userController.getHistory)

  .put('/profile/updateProfile', userController.updateProfile)

  .post('/login', userController.login)
  .post('/signup', userController.signup);

module.exports = router;
