const express = require('express');
const { body } = require('express-validator');
const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth.js');

const router = express.Router();

// GET /feed/posts
router.get('/posts', isAuth, feedController.getPosts);

// POST /feed/post
router.post(
  '/post',
  isAuth,
  [
    body('title').isLength({ min: 5 }).withMessage('Enter at least 5 letters'),
    body('content')
      .isLength({ min: 5 })
      .withMessage('Enter at least 8 letters'),
  ],
  feedController.createPost
);

router.get('/:postId', isAuth, feedController.getPost);

router.delete('/:postId', isAuth, feedController.deletePost);
router.put(
  '/post/:postId',
  isAuth,
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  feedController.updatePost
);

module.exports = router;
