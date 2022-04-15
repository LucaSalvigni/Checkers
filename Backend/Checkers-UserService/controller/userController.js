const crypto = require('crypto');
const emailValidator = require('email-validator');
const PasswordValidator = require('password-validator');
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

/**
 * Simple method to log some messages
 * @param {*} msg to log
 */
function log(msg) {
  if (process.env.DEBUG) {
    console.log(msg);
  }
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
