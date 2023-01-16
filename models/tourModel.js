///schemas
const mongoose = require('mongoose'); //we need this mongodb driver which allows our node code to access and iteract with mongodb DB
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal than 40 characters'],
      minlength: [10, 'A tour name must have more or equal than 40 characters'],
    },
    slug: String,
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: difficulty, medium, easy',
      },
      //we can use enum only with strings and not with numbers
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'ratings must be above 1.0 '],
      max: [5, 'rating must be above 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //in this function it has access to the inputted value
          //here "this" only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
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
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//we  can have middleware running before and after a certain event. in this middleware functin itself we acces to the this keyword
//DOCUMENT MIDDLEWARE: runs before '.save() and  .create() only
tourSchema.pre('save', function (next) {
  console.log(this, '----------------------------------------');
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function(next) {
//     console.log("Will Save the Document... ");
//     next();
// })

//we can run or repeat multiple middleware with the same hook(i.e save )
//post hook middleware will always runs after the pre hook middleware and it has extra acces(document which will be
//being processed) and in this hook they will not have the "this" access
// tourSchema.post('save', function(doc, next){
//     console.log(doc);
//    next();
// })

//PRE Find hook--> a middleware that is gonna run before any find query is executed. and the 'this' keyword will point to the current query not the document
//tourSchema.pre('find', function(next) {
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

// tourSchema.pre('findOne', function(next) {
//     this.find({secretTour: { $ne: true } } )
//     next();
// });

//in this post hook we will have acces all the docs th
// tourSchema.post(/^find/, function (next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds!}`);
//   console.log(docs);
//   next();
// });

//AGGREGATION MIDDLEWARE
//we could do it on the controller functions also but what if there is so any aggregation and we might can forget it to include $secretTour: true
//so we will handle it on the model level.
//before the aggregation is actually executed
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  //console.log(this.pipeline)
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

//creating an instance of the Tour Model or creating a document
// const testTour = new Tour({
//     name: "The Forest Hiker",
//     rating: 4.7,
//     price: 120
// });
// //now we can do apply some methods on this instance like
// testTour.save().then(doc =>{     //in this doc, we get acces to the document that was just saved to the databse
//     console.log("our doc", doc)
// }).catch(err => {
//     console.log("ERROR :(", err)
// })

/////
//Data validations with mongoose
//we can build our cstom validators too.
//A validator is actually really just a simple functions which should return either true or false. if it returns false then it means there is an error otherwise validation is correct and so input can be accepted

//there are couple of libraries on npm for data validation that we can simply plug in here as custom validators that we do not have to write ourselves.
//popular library is called validator
