const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');

const feedRoutes = require('./routes/feed');

const app = express();

const storage = multer.diskStorage({//configure where location for multer to save files and set files name
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimeType === 'images/png' || file.mimeType === 'images/jpg' || file.mimeType === 'images/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(bodyParser.json()); //middleware using body parser to parse incoming json data
app.use(multer({storage: storage, fileFilter: fileFilter}).single('image'));//configure multer middleware by executing multer function which takes storage and fileFilter parameters. The single function is then called to informa multer to extract a single file from the field 'image' in the request body
app.use('/images', express.static(path.join(__dirname, 'images'))); //middleware for serving static files used for every request going to /images. 

app.use((req, res, next) => {// set response headers to allow CORS. This can be done only server side
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); //allow client to send request with authorization data and to define the content type of the request
    next();//forward request to the next middleware
});

app.use('/feed', feedRoutes); //forward any incoming request starting with 'feed' to feedRoutes

app.use((error, req, res, next) => {
const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({message: message});
});

mongoose.connect('mongodb+srv://simone:oMDjbSwyr6cjp0sW@cluster0.8pppf.mongodb.net/messages?retryWrites=true&w=majority').then(
    result => { 
        console.log('Connected to database')
        app.listen(8080);
    }
).catch(err => 
    console.log(err)
    );

