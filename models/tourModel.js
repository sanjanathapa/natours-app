///schemas
const mongoose = require('mongoose')  //we need this mongodb driver which allows our node code to access and iteract with mongodb DB

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A tour must have a name"],
        unique: true,
        trim: true
    },
    duration :{
         type: Number,
         required: [true, "A tour must have a duration"]
    },
    maxGroupSize: {
        type: Number,
        required: [true, "A tour must have a group size"]
    },
    difficulty: {
        type: String,
        required: [true, "A tour must have a difficulty"]
    },
    ratingsAverage: {
        type: Number,
        default: 4.5 
    },
    ratingQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, "A tour must have a price"]
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required: [true, "A tour must have a description"]
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, "A tour must have a cover image"]
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    startDates: [Date]
});

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour

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