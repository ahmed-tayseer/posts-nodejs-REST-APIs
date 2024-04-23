const http = require('http');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const app = express();
const server = http.createServer(app);
const io = require('./socket').init(server);

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.fadgj0l.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority&appName=Cluster0`;

// List of allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(' ');

app.use((req, res, next) => {
  // Check if the request origin is in the list of allowed origins
  if (allowedOrigins.includes(req.headers.origin))
    // Set the Access-Control-Allow-Origin header to the request origin
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);

  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Listen to the connection channel which triggered when client openSocket('http://localhost:8080')
io.on('connection', () => {
  console.log('Client connected');
});
// console.log(io.engine.opts.cors);

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true); // true ==> save the file in req.file
  } else {
    cb(null, false); // false ==> wont save it and req.file = undefined
  }
};

app.use('/images', express.static(path.join(__dirname, 'images')));
// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  res.status(status).json({
    message: error.message,
    data: error.data,
  });
});
mongoose
  .connect(MONGODB_URI)
  .then(result => {
    server.listen(process.env.PORT || 8080); // instead of app.listen
  })
  .catch(err => {
    console.log(err);
  });
