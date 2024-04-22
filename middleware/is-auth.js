const jwt = require('jsonwebtoken');
const User = require('../models/user');
module.exports = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const err = new Error('not auth');
    err.statusCode = 401;
    throw err;
  }

  const token = authHeader.split(' ')[1];

  let decodedToken;
  try {
    // verify: check the token with the secret key and decode the data
    // in try and catch as it can fail for some reason
    decodedToken = jwt.verify(token, 'somesupersecretsecret');
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }

  // in case verfication faild (wrong token)
  if (!decodedToken) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }

  // the decoded token has data we added in login
  // req.userId = decodedToken.userId;
  try {
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      const err = new Error('User not found!');
      err.statusCode = 401;
      throw err;
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
