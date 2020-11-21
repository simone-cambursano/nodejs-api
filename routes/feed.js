const express = require('express');
const { body } = require('express-validator/check'); //method to validate the request body from the check sub-package

const router = express.Router();

const feedController = require('../controllers/feed');


router.get('/posts', feedController.getPosts);

router.get('/post/:postId', feedController.getPost);

router.post('/post', [ //array of middlewares used to validate body fields
    body('title')
    .trim()
    .isLength({min: 5}), //use body function to validate title field
    body('content')
    .trim()
    .isLength({min: 5}),
], feedController.createPost);

router.put('/post/:postId', [ //array of middlewares used to validate body fields
    body('title')
    .trim()
    .isLength({min: 5}), //use body function to validate title field
    body('content')
    .trim()
    .isLength({min: 5}),
], feedController.updatePost); //put requests as post have request body for sending the data

module.exports = router;