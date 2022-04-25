const crypto = require('crypto');
const emailValidator = require('email-validator');
const PasswordValidator = require('password-validator');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const _ = require('lodash');
const User = require('../models/userModel');

// Setting a password validator to user password input
const pswValidator = new PasswordValidator()
  .is().min(8)
  .is()
  .max(100)
  .has()
  .uppercase(2)
  .has()
  .lowercase(2)
  .has()
  .digits(2)
  .has()
  .not()
  .spaces()
  .has()
  .symbols(1);

// Setting the token
const jsecretPath = './jwt_secret';

/**
 * Simple method to log some messages
 * @param {*} msg to log
 */
function log(msg) {
  console.log(msg);
}

/**
 * Generats a random string of given length
 */
function randomString(length) {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}
/**
 *
 * @param {*} psw  to be salted
 * @param {*} salt to apply to psw
 * @returns  salted psw
 */
function saltFunction(psw, salt) {
  const hash = crypto.createHmac('sha512', salt);
  hash.update(psw);
  return hash.digest('hex');
}

/**
 * Trie to load the token
 * @returns the new secret
 */
function loadJwtSecret() {
  if (fs.existsSync(jsecretPath)) {
    return fs.readFileSync(jsecretPath, 'utf-8');
  }
  const newSecret = randomString(32);
  fs.writeFileSync(jsecretPath, newSecret);
  return newSecret;
}

const jwtSecret = loadJwtSecret();

/**
 * Tries to sign up a new user
 */
exports.signup = async function (req, res) {
  const { username } = req.body;
  const email = req.body.mail;
  const { password } = req.body;
  const { firstName } = req.body;
  const { lastName } = req.body;
  log(`${email} is trying to sign up`);
  log(email);
  if (!emailValidator.validate(email)) {
    log(`${email} not valid`);
    res.status(400).send({ message: 'Email not valid.' }).end();
  } else if (!username || username.length < 3 || username.length > 15) {
    log(`${username} not valid`);
    res.status(400).send({ message: 'Username not valid.' }).end();
  } else if (!pswValidator.validate(password)) {
    log(`Password for user ${email} not valid`);
    res.status(400).send(pswValidator.validate(password, { details: true })).end();
  } else {
    log(`Checking if ${email} already exists`);
    const user = await User.findOne({ mail: email }).lean();
    const salt = randomString(128);
    const hashPsw = saltFunction(password, salt);
    let newUser = null;
    if (user === null) {
      log(`Signign up a new user with mail ${email}`);
      newUser = new User({
        username,
        stars: 0,
        firstName,
        lastName,
        wins: 0,
        losses: 0,
        ties: 0,
        avatar: '',
        mail: email,
        password: hashPsw,
        salt,
        nationality: '',
      });
      await newUser.save();
      if (newUser === null) {
        res.status(500).send({ message: 'Something went wrong during sign up, please try again' });
      } else {
        res.status(200).send({ message: 'Sign up completed successfully.' });
      }
    } else {
      log(`Sadly someone else is already registered with ${email}`);
      res.status(400).send({ message: 'An existing account has already been associated with this email.' });
    }
  }
};

/**
 * Methods for tries to login a user
 * @param {*} req
 * @param {*} res
 */
exports.login = async function (req, res) {
  const email = req.body.mail;
  const { password } = req.body;
  log(`${email}is trying to login`);
  if (email.trim() === '' || password.trim() === '') {
    res.status(400).send({ message: "Login parameters can't have empty values" });
  } else {
    const registeredUser = await User.findOne({ mail: email }, 'username first_name last_name mail salt password stars nationality wins losses avatar');
    if (registeredUser) {
      const allegedPassword = saltFunction(password, registeredUser.salt);
      if (allegedPassword === registeredUser.password) {
        log(`${email} just logged in successfully`);
        // Will those two lines work?
        const token = jwt.sign({ user: { email: registeredUser.mail, username: registeredUser.username } }, jwtSecret, { expiresIn: '1 day' });
        res.status(200).json({
          token,
          message: `Authentication successfull, welcome back ${registeredUser.username}!`,
          user: {
            username: registeredUser.username,
            first_name: registeredUser.first_name,
            last_name: registeredUser.last_name,
            mail: email,
            stars: registeredUser.stars,
            wins: registeredUser.wins,
            losses: registeredUser.losses,
            avatar: registeredUser.avatar,
          },
        });
      } else {
        log(`${email} just failed authentication`);
        res.status(400).send({ message: 'Authentication failed, wrong email and/or password' });
      }
    } else {
      log(`${email} is not registered so he cannot authenticate`);
      res.status(400).send({ message: 'Authentication failed, wrong email and/or password' });
    }
  }
};

/**
 * Tries to get a new token for a user
 */
exports.refresh_token = async function (req, res) {
  const { mail } = req.body.params;
  const { token } = req.body.params;
  const registeredUser = await User.findOne({ mail }, 'username first_name last_name mail stars nationality wins losses avatar');
  if (registeredUser) {
    const tokenMail = JSON.parse(Buffer.from(token.split('.')[1], 'base64')).user.email;
    if (mail === tokenMail) {
      // Check this await
      const checkToken = jwt.sign({ user: { email: registeredUser.mail, username: registeredUser.username } }, jwtSecret, { expiresIn: '1 day' });
      if (checkToken) {
        res.status(200).json({
          checkToken,
          user: {
            username: registeredUser.username,
            first_name: registeredUser.first_name,
            last_name: registeredUser.last_name,
            mail: registeredUser.mail,
            stars: registeredUser.stars,
            wins: registeredUser.wins,
            losses: registeredUser.losses,
            avatar: registeredUser.avatar,
          },
        });
      } else {
        res.status(500).send({ message: 'Error while refreshing token' });
      }
    } else {
      res.status(400).send({ message: 'Wrong mail' });
    }
  } else {
    res.status(400).send({ message: 'No such user' });
  }
};

/**
 * Tries to verify the current user's token
 * @param {*} req
 * @param {*} res
 */
exports.verify_token = async function (req, res) {
  const { authorization } = req.body.headers;
  try {
    if (typeof authorization !== 'undefined') {
      const bearer = authorization.split(' ');
      const bToken = bearer[1];
      req.token = bToken;
      console.log('ciao');
      const token = jwt.verify(req.token, jwtSecret);
      log(`veryfing token for ${token.user.email}`);
      if (token) {
        log(`token ok for user ${token.user.email}`);
        res.status(200).json({ token, user: token.user });
      } /* else {
        log(`token error for user ${token.user.email}`);
        res.status(400).send({ message: 'Token verification error, please log-in again.' });
      } */
    }
  } catch (err) {
    log('Someone is trying to do some nasty illegal things');
    res.status(400).send({ message: 'User not authenticated, please log-in again.' });
  }
};

exports.getProfile = async function (req, res) {
  // WILL THIS QUERY WORK?
  const { mail } = req.body.params;
  log(`Getting ${mail} profile`);
  try {
    const data = await User.findOne({ mail }, 'username avatar first_name last_name stars mail').lean();
    if (data === null) {
      log(`Didn't found any profile associated to ${mail}`);
      res.status(400).json({ error: 'Cannot find any player with such ID' });
    } else {
      log(`Found profile associated to ${mail}, sending it back`);
      res.json({
        username: data.username,
        avatar: data.avatar === '' ? 'https://picsum.photos/id/1005/400/250' : data.avatar,
        first_name: data.first_name,
        last_name: data.last_name,
        stars: data.stars,
        mail: data.mail,
      });
    }
  } catch {
    res.status(500).json({ error: 'Error while retrieving player profile from DB' });
  }
};
exports.getHistory = async function (req, res) {
  try {
    const { mail } = req.body.params;
    const user = await User.find({ mail }, 'wins losses');
    const data = [];
    log(`Getting history for user ${mail}`);
    if (user.length === 0) {
      log(`lol there's no such user as ${mail}`);
      res.status(400).json({ error: 'Cannot find any player with such ID' });
    } else {
      log(`Successfully got history for ${mail}`);
      data.push(user.wins);
      data.push(user.losses);
      res.status(200).json(data);
    }
  } catch {
    res.status(500).json({ error: 'Error while retrieving player profile from DB' });
  }
};

// WILL THIS WORK?
exports.getLeaderboard = async function (__, res) {
  try {
    const users = await User.find({}, 'username avatar stars wins losses ties').sort({ stars: 'desc' });
    if (users != null) {
      users.map((user) => {
        user.avatar = user.avatar === '' ? 'https://picsum.photos/id/1005/400/250' : user.avatar;
        return users;
      });
      log('Retrieving and sending leaderboard');
      res.status(200).json(users);
    } /* else {
      res.status(200).send({ message: 'There is no one in the leaderboard.' });
    } */
  } catch (err) {
    log(`Something went wrong while retrieving leaderboard\n${err}`);
    res.status(500).send({ message: 'Something went wrong.' });
  }
};

exports.updateProfile = async function (req, res) {
  const userMail = req.body.mail;
  const { mail } = req.body.params;
  if (mail === userMail) {
    log(`Updating ${userMail} profile`);
    try {
      let newValues = {
        first_name: req.body.params.first_name,
        last_name: req.body.params.last_name,
        username: req.body.params.username,
        avatar: req.body.params.avatar,
      };
      newValues = _.pickBy(newValues, _.identity);
      const newUser = await User.findOneAndUpdate(
        { mail: userMail },
        { $set: newValues },
      );
      log(`Successfully updated profile for ${userMail}`);
      res.status(200).json({
        username: newUser.username,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        mail: newUser.mail,
        stars: newUser.stars,
        avatar: newUser.avatar,
      });
    } catch (err) {
      log(`Something went wrong while updating ${userMail} profile`);
      log(err);
      res.status(400).send({ message: 'Something went wrong while updating a user, please try again' });
    }
  } else {
    res.status(400).json({ message: "You can't change the email associated to an account." });
  }
};
