const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth.js');
const User = require('../models/user.js');
const isAuth = require('../middleware/is-auth.js');

const router = express.Router();

router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(user => {
          if (user) throw new Error('email exists!');
        });
      }),
    body('name').trim().not().isEmpty(),
    body('password').isLength({ min: 5 }), // 5
  ],
  authController.signup
);

router.post('/login', authController.login);

router.get('/status', isAuth, authController.getUserStatus);

router.patch(
  '/status',
  isAuth,
  [body('status').trim().not().isEmpty()],
  authController.updateUserStatus
);

module.exports = router;
