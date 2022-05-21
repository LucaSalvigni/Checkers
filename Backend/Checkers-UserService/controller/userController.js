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

/**
 * Tries to sign up a new user
 */
exports.signup = async function (req, res) {
  const { username } = req.body;
  const { mail } = req.body;
  const { password } = req.body;
  const { firstName } = req.body;
  const { lastName } = req.body;
  log(`${mail} is trying to sign up`);
  if (!emailValidator.validate(mail)) {
    log(`${mail} not valid`);
    res.status(400).send({ message: 'Email not valid.' }).end();
  } else if (!username || username.length < 3 || username.length > 15) {
    log(`${username} not valid`);
    res.status(400).send({ message: 'Username not valid.' }).end();
  } else if (!pswValidator.validate(password)) {
    log(`Password for user ${mail} not valid`);
    res.status(400).send(pswValidator.validate(password, { details: true })).end();
  } else {
    log(`Checking if ${mail} already exists`);
    const user = await User.findOne({ mail }).lean();
    const salt = randomString(128);
    const hashPsw = saltFunction(password, salt);
    let newUser = null;
    if (user === null) {
      log(`Signign up a new user with mail ${mail}`);
      newUser = new User({
        username,
        stars: 0,
        firstName,
        lastName,
        wins: 0,
        losses: 0,
        ties: 0,
        avatar: 'https://picsum.photos/id/1005/400/250',
        mail,
        password: hashPsw,
        salt,
      });
      await newUser.save();
      res.status(200).send({ message: 'Sign up completed successfully.' });
      /* if (newUser === null) {
        res.status(500).send({ message: 'Something went wrong during sign up, please try again' });
      } else {
        res.status(200).send({ message: 'Sign up completed successfully.' });
      } */
    } else {
      log(`Sadly someone else is already registered with ${mail}`);
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
  const { mail } = req.body;
  const { password } = req.body;
  log(`${mail} is trying to login`);
  if (mail === undefined || password === undefined) {
    log("Can't manage a login request without mail and/or password");
    res.status(400).send({ message: "Can't manage a login request without mail and/or password" });
  } else if (mail.trim() === '' || password.trim() === '') {
    res.status(400).send({ message: "Login parameters can't have empty values" });
  } else {
    const registeredUser = await User.findOne({ mail }, 'username firstName lastName mail salt password stars nationality wins losses avatar');
    if (registeredUser) {
      const allegedPassword = saltFunction(password, registeredUser.salt);
      if (allegedPassword === registeredUser.password) {
        log(`${mail} just logged in successfully`);
        // Will those two lines work?
        const token = jwt.sign({ user: { mail: registeredUser.mail, username: registeredUser.username } }, loadJwtSecret(), { expiresIn: '1 day' });
        res.status(200).json({
          token,
          message: `Authentication successfull, welcome back ${registeredUser.username}!`,
          user: {
            username: registeredUser.username,
            firstName: registeredUser.firstName,
            lastName: registeredUser.lastName,
            mail,
            stars: registeredUser.stars,
            wins: registeredUser.wins,
            losses: registeredUser.losses,
            avatar: registeredUser.avatar,
          },
        });
      } else {
        log(`${mail} just failed authentication`);
        res.status(400).send({ message: 'Authentication failed, wrong email and/or password' });
      }
    } else {
      log(`${mail} is not registered so he cannot authenticate`);
      res.status(400).send({ message: 'Authentication failed, wrong email and/or password' });
    }
  }
};

/**
 * Tries to get a new token for a user
 */
exports.refresh_token = async function (req, res) {
  const { mail } = req.query;
  const { token } = req.query;
  const registeredUser = await User.findOne({ mail }, 'username firstName lastName mail stars nationality wins losses avatar');
  if (registeredUser) {
    const tokenMail = JSON.parse(Buffer.from(token.split('.')[1], 'base64')).user.mail;
    if (mail === tokenMail) {
      log('Check token');
      // Check this await
      const checkToken = jwt.sign({ user: { mail: registeredUser.mail, username: registeredUser.username } }, loadJwtSecret(), { expiresIn: '1 day' });
      res.status(200).json({
        checkToken,
        user: {
          username: registeredUser.username,
          firstName: registeredUser.firstName,
          lastName: registeredUser.lastName,
          mail: registeredUser.mail,
          stars: registeredUser.stars,
          wins: registeredUser.wins,
          losses: registeredUser.losses,
          avatar: registeredUser.avatar,
        },
      });
      /* if (checkToken) {
        res.status(200).json({
          checkToken,
          user: {
            username: registeredUser.username,
            firstName: registeredUser.firstName,
            lastName: registeredUser.lastName,
            mail: registeredUser.mail,
            stars: registeredUser.stars,
            wins: registeredUser.wins,
            losses: registeredUser.losses,
            avatar: registeredUser.avatar,
          },
        });
      } else {
        res.status(500).send({ message: 'Error while refreshing token' });
      } */
    } else {
      log('Wrong mail');
      res.status(400).send({ message: 'Wrong mail' });
    }
  } else {
    log('No such user');
    res.status(400).send({ message: 'No such user' });
  }
};

/**
 * Tries to verify the current user's token
 * @param {*} req
 * @param {*} res
 */
exports.verify_token = async function (req, res) {
  const { authorization } = req.headers;
  try {
    // if (typeof authorization !== 'undefined') {
    const bearer = authorization.split(' ');
    const bToken = bearer[1];
    req.token = bToken;
    const token = jwt.verify(req.token, loadJwtSecret());
    log(`veryfing token for ${token.user.mail}`);
    // if (token) {
    log(`token ok for user ${token.user.mail}`);
    res.status(200).json({ token, user: token.user });
    /* } else {
        log(`token error for user ${token.user.email}`);
        res.status(400).send({ message: 'Token verification error, please log-in again.' });
      }
    } */
  } catch (err) {
    log('Someone is trying to do some nasty illegal things');
    res.status(400).send({ message: 'User not authenticated, please log-in again.' });
  }
};

exports.getProfile = async function (req, res) {
  // WILL THIS QUERY WORK?
  const { mail } = req.query;
  log(`Getting ${mail} profile`);
  try {
    const data = await User.findOne({ mail }, 'username avatar firstName lastName stars mail').lean();
    res.json({
      id: data._id,
      username: data.username,
      avatar: data.avatar,
      firstName: data.firstName,
      lastName: data.lastName,
      stars: data.stars,
      mail: data.mail,
    });
    log(`Found profile associated to ${mail}, sending it back`);
    /* if (data === null) {
      log(`Didn't found any profile associated to ${mail}`);
      res.status(400).json({ error: 'Cannot find any player with such ID' });
    } else {
      log(`Found profile associated to ${mail}, sending it back`);
      res.json({
        username: data.username,
        avatar: data.avatar === '' ? 'https://picsum.photos/id/1005/400/250' : data.avatar,
        firstName: data.firstName,
        lastName: data.lastName,
        stars: data.stars,
        mail: data.mail,
      });
    } */
  } catch {
    log(`Didn't found any profile associated to ${mail}`);
    res.status(400).json({ error: 'Cannot find any player with such ID' });
    // res.status(400).json({ error: 'Error while retrieving player profile from DB' });
  }
};

exports.getHistory = async function (req, res) {
  // try {
  const { mail } = req.query;
  const data = [];
  log(`Getting history for user ${mail}`);
  const user = await User.find({ mail }, 'wins losses');
  if (user.length === 0) {
    log(`lol there's no such user as ${mail}`);
    res.status(400).json({ error: 'Cannot find any player with such ID' });
  } else {
    log(`Successfully got history for ${mail}`);
    data.push(user.wins);
    data.push(user.losses);
    res.status(200).json(data);
  }
  /* } catch {
    res.status(500).json({ error: 'Error while retrieving player profile from DB' });
  } */
};

exports.getLeaderboard = async function (__, res) {
  const users = await User.find({}, 'username avatar stars wins losses ties').sort({ stars: 'desc' });
  log('Retrieving and sending leaderboard');
  res.status(200).json(users);
  /* if (users.length !== 0) {
    users.map((user) => {
      user.avatar = user.avatar === '' ? 'https://picsum.photos/id/1005/400/250' : user.avatar;
      return users;
    });
    log('Retrieving and sending leaderboard');
    res.status(200).json(users);
  /*} else {
    res.status(200).send({ message: 'There is no one in the leaderboard.' });
  }
   try {
const users = await User.find({}, 'username avatar stars wins losses ties').sort({ stars: 'desc' });
    if (users != null) {
      users.map((user) => {
        user.avatar = user.avatar === '' ? 'https://picsum.photos/id/1005/400/250' : user.avatar;
        return users;
      });
      log('Retrieving and sending leaderboard');
      res.status(200).json(users);
    } else {
      res.status(200).send({ message: 'There is no one in the leaderboard.' });
    }
  } catch (err) {
    log(`Something went wrong while retrieving leaderboard\n${err}`);
    res.status(500).send({ message: 'Something went wrong.' });
  } */
};

exports.updateProfile = async function (req, res) {
  let newValues = req.body.params;
  if (newValues === undefined) {
    res.status(400).send({ message: 'Need some new values to update data' });
  } else {
    const { mail } = req.body;
    if (newValues.mail === mail) {
      log(`Updating ${mail} profile`);
      try {
        newValues = _.pickBy(newValues, _.identity);
        const newUser = await User.findOneAndUpdate(
          { mail },
          { $set: newValues },
        );
        res.status(200).json({
          username: newUser.username,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          mail: newUser.mail,
          stars: newUser.stars,
          avatar: newUser.avatar,
        });
        log(`Successfully updated profile for ${mail}`);
      } catch (err) {
        log(`Something went wrong while updating ${mail} profile`);
        res.status(400).send({ message: 'Something went wrong while updating a user, please try again' });
      }
    } else {
      res.status(400).json({ message: "You can't change the email associated to an account." });
    }
  }
};

exports.updatePoints = async function (req, res) {
  const { mail } = req.body;
  const { stars } = req.body;
  const { won } = req.body;
  const singleMatch = 1;
  const { tied } = req.body;
  const userStars = await User.findOne({ mail });
  let user = null;
  try {
    if (tied) {
      user = await User.findOneAndUpdate({ mail }, { $inc: { ties: singleMatch, stars } });
    } else if (won) {
      user = await User.findOneAndUpdate({ mail }, { $inc: { wins: singleMatch, stars } });
    } else if (userStars.stars - Math.abs(parseInt(stars, 10)) < 0) {
      // eslint-disable-next-line max-len
      user = await User.findOneAndUpdate({ mail }, { $inc: { ties: singleMatch, stars: -userStars.stars } });
    } else {
      user = await User.findOneAndUpdate({ mail }, { $inc: { stars, losses: singleMatch } });
    }
    if (user != null) {
      log(`Just updated points for ${mail}`);
      res.status(200).json({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        mail: user.mail,
        wins: user.wins,
        losses: user.losses,
        stars: user.stars,
      });
    } else {
      log(`Couldn't update points for ${mail}`);
      res.status(400).send({ message: "We weren't able to update points for such user" });
    }
  } catch (err) {
    log(`Something went wrong while updating points for ${mail}`);
    log(err);
    res.status(500).send({ message: 'Something went wrong while updating your points' });
  }
};
