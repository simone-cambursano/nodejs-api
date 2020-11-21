const { validationResult, body } = require('express-validator/check');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
    Post.find().then(
        posts => {
            res.status(200).json({
                message: 'Fetched posts successfully.',
                posts: posts
            });
        }
    ).catch(err => {
        if(!err.statusCode) {
            error.statusCode = 500;
            next(err);
        }
    });
};

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId).then(
        post => {
            if(!post) {
                const error = new Error('Post not found.');
                error.statusCode = 404;
                throw error; //it is ok to throw an error in then block even if this is asyncronous because the error will be forwarded to the catch that will then call next and reach the error handling middleware 
            }
            res.status(200).json({
                message: 'Post fetched successfully',
                post: post
            });
        }).catch(err => {
            if(!err.statusCode) {
                error.statusCode = 500;
                next(err);
            }
        });
};

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422; //custom property created for the error object
        throw error; //immediately exit the function and reach the next error hadling middleware in app.js
    }
    // if(!req.file) {//check if image is provided in the request 
    //     const error = new Error('No image provided.');
    //     error.statusCode = 422;
    //     throw error;
    // }
    const title = req.body.title;
    const content = req.body.content;
    //const imageUrl = req.file.path;//multer generates a path variable with the location at which it stores the file on the server
    const imageUrl = req.body.image;
    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: { name: 'Simone' }
    });
    //Create post in db
    post.save().then(
        result => {
            res.status(201).json({
                message: 'Post created successfully!',
                post: result
            });
        }
    ).catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500; //assign status code 500 as something went wrong on the server
            next(err); //cannot throw error in async code block, this will not reach the error handling middleware. Insteade use next to reach the middleware
        }
    });
};

exports.updatePost = (get, set, next) => {
    const postId = req.params.postId;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422; //custom property created for the error object
        throw error; //immediately exit the function and reach the next error hadling middleware in app.js
    }
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    if(req.file) {
        imageUrl = req.file.path;
    }
    if(!imageUrl) {
        const error = new Error('No image picked.');
        error.statusCode = 404;
        throw error; 
    }
    Post.findById(postId).then(post => {
        if(!post) {
            const error = new Error('Post not found.');
            error.statusCode = 404;
            throw error;
        }
        post.title = title;
        post.content = content;
        post.imageUrl = imageUrl;
        return post.save(); 
    }).then(result => {
        res.status(200).json({
            message: 'Post updated.',
            post: result
        });
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
            next(err); 
        }
    });
};