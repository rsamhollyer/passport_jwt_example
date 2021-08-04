const mongoose = require('mongoose');
const router = require('express').Router();

const User = mongoose.model('User');
const passport = require('passport');
const utils = require('../lib/utils');

// TODO
router.get('/protected', (req, res, next) => {});

// TODO
router.post('/login', (req, res, next) => {});

router.post('/register', (req, res, next) => {
  const { salt, hash } = utils.genPassword(req.body.password);

  const newUser = new User({
    username: req.body.username,
    hash,
    salt,
  });

  newUser
    .save()
    .then(user => res.json({ success: true, user }))
    .catch(err => next(err));
});

module.exports = router;
