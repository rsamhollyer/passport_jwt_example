const mongoose = require('mongoose');
const router = require('express').Router();

const User = mongoose.model('User');
// const passport = require('passport');
const utils = require('../lib/utils');

router.get(
  '/protected',
  utils.authMiddleware,
  // passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    console.log(req.jwt);
    res.status(200).json({ success: true, msg: 'You are an authorized user' });
  }
);

router.post('/login', (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then(user => {
      if (!user) {
        res.status(401).json({ success: false, msg: 'could not find user' });
      }

      const isValid = utils.validPassword(
        req.body.password,
        user.hash,
        user.salt
      );
      if (isValid) {
        const tokenObject = utils.issueJWT(user);
        res.status(201).json({
          success: true,
          user,
          token: tokenObject.token,
          expiresIn: tokenObject.expires,
        });
      } else {
        res
          .status(401)
          .json({ success: false, msg: 'invalid user or password' });
      }
    })
    .catch(err => {
      next(err);
    });
});

router.post('/register', (req, res, next) => {
  const { salt, hash } = utils.genPassword(req.body.password);

  const newUser = new User({
    username: req.body.username,
    hash,
    salt,
  });

  newUser
    .save()
    .then(user => {
      const jwt = utils.issueJWT(user);
      res.json({
        success: true,
        user,
        token: jwt.token,
        expiresIn: jwt.expires,
      });
    })
    .catch(err => next(err));
});

module.exports = router;
