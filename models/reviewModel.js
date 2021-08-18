// review // rating // createdAt // ref to tour // ref to user
const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      default: 3,
      max: [5.0, 'Maximum rating is 5.0'],
      min: [0.0, 'Minimum rating is 1.0'],
      required: [true, 'Rating is mandatory'],
    },

    review: {
      type: String,
      trim: true,
      required: [true, 'Review is mandatory'],
    },

    createdAt: {
      type: Date,
      default: Date.now(),
    },

    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user!'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

//MIDDLEWARES

// Query Middlewares
reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user' });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  let options = {};

  if (stats.length > 0) {
    options = {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating,
    };
  } else {
    options = {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    };
  }

  await Tour.findByIdAndUpdate(tourId, options);
};

reviewSchema.post(/save|^findOne/, async (doc, next) => {
  await doc.constructor.calcAverageRatings(doc.tour);
  next();
});

// // Document Middleware
// reviewSchema.pre('save', function (next) {
//   this.constructor.calcAverageRatings(this.tour);
//   next();
// });

// // Query Middleware
// reviewSchema.pre(/^findOneAnd/, async function (next) {
//   this.r = await this.findOne();
//   next();
// });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
