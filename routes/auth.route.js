const router = require('express').Router();
const User = require('../models/user.model');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const { ensureLoggedOut, ensureLoggedIn } = require('connect-ensure-login');
const { registerValidator } = require('../utils/validators');

router.get(
  '/login',
  ensureLoggedOut({ redirectTo: '/' }),
  async (req, res, next) => {
    res.render('login', { user: req.user });
  }
);

router.post(
  '/login',
  ensureLoggedOut({ redirectTo: '/' }),
  passport.authenticate('local', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
  })
);

router.get(
  '/register',
  ensureLoggedOut({ redirectTo: '/' }),
  async (req, res, next) => {
    res.render('register', { user: req.user });
  }
);

router.post(
  '/register',
  ensureLoggedOut({ redirectTo: '/' }),
  registerValidator,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
          req.flash('error', error.msg);
        });
        res.render('register', {
          email: req.body.email,
          messages: req.flash(),
          user: req.user,
        });
        return;
      }

      const { email } = req.body;
      const doesExist = await User.findOne({ email });
      if (doesExist) {
        req.flash('warning', 'Username/email already exists');
        res.redirect('/auth/register');
        return;
      }
      const user = new User(req.body);
      await user.save();
      req.flash(
        'success',
        `${user.email} registered successfully, you can now login`
      );
      res.redirect('/auth/login');
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/logout',
  ensureLoggedIn({ redirectTo: '/' }),
  async (req, res, next) => {
    req.logOut((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  }
);

module.exports = router;
