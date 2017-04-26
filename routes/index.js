require('./../config/passport');

const express = require('express');
const router = express.Router();
const AuthenticationController = require('./../controllers/authentication/authentication');
const passport = require('passport');

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });


/* GET home page. */
router.get('/', requireAuth, (req, res) => {
  res.render('index', { title: 'Express' });
});

// Registration route
router.post('/register', AuthenticationController.register);

// Login route
router.post('/login', requireLogin, AuthenticationController.login);


module.exports = router;
