/* eslint-disable func-names */
/* eslint-disable no-undef */
import mongoose from 'mongoose';
// import slugify from 'slugify';

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A Tour Must have a name'],
      unique: true,
      trim: true,
    },
    slug: String,
    secretTour: {
      type: Boolean,
      default: false,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      trim: true,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A Tour Must have a price'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true, // THis will remove the whitespace from the end and start of the text
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, //  This way we exclude it so no it will be not send as response to client
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field

// eslint-disable-next-line func-names
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//  DOCUMENT MIDDLEWARE
//  its only works for .save() and .create()

// tourSchema.pre('save', function (next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

// tourSchema.post('save', (doc, next) => {
//   console.log('doc ', doc);
//   next();
// });

//  QUERY  MIDDLEWARE

//  So now for all find Query this function will get trigger
tourSchema.pre(/^find/, function (next) {
  // Here this is here a query Object
  this.find({ secretTour: { $ne: true } });
  this.select('-secretTour');
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (doc, next) {
  console.log(`Total time it take to do query ${Date.now() - this.start} ms`);
  console.log('doc ', doc);
  next();
});

//  AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  // Here in this function this is our aggregation framework
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);
export default Tour;
