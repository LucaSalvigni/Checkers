const express = require('express');

const router = express.Router();
const userController = require('../controller/userController');

router
// Profile routes
  .get('/authenticate', userController.verify_token)
  .get('/refresh_token', userController.refresh_token)
  .post('/login', userController.login)
  .post('/signup', userController.signup);

module.exports = router;
