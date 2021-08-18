const path = require('path');
const express = require('express');
const morgan = require('morgan'); // 3rd party middleware
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const viewRouter = require('./routes/viewRoutes');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const errorController = require('./controllers/errorController');

const app = express();

app.set('view engine', 'pug'); // Setting template engine for website rendering
app.set('views', path.join(__dirname, 'views')); // Path must be absolute. './' is relative to the directive where app is launched.

// 1) MIDDLEWARES

// Serving static files
app.use(express.static(path.join(__dirname, 'public'))); // Including static files

//Set security HTTP headers

app.use(helmet({ contentSecurityPolicy: false }));

//console.log(process.env.NODE_ENV);
// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //HTTP request logger middleware
}

// Limit requests from the API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP.Try again later!',
});

app.use('/api', limiter);

// Body parse, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); // A middleware to get information of incoming request in json format.
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser({ contentSecurityPolicy: false })); // Parses data from cookie
//Data sanitizatoin aganist NoSQL query injection
app.use(mongoSanitize());

// Data sanitization aganist XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'price',
      'difficulty',
    ],
  })
);

//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) MIDDLEWARES APPLIED TO SPECIFIC ROUTES

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/booking', bookingRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// ERROR HANDLING FOR TOUR CONTROLLERS
app.use(errorController);

module.exports = app;
// 3) Start Server

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: `Hello from the server side`, app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint...');
// });

// 2) ROUTE HANDLERS

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);
