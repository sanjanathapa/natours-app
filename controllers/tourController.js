const { query } = require('express');
const Tour = require('./../models/tourModel');

exports.createTour = async (req, res) => {
  try{
    // const newTour = new Tour({});
    // newTour.save()
  console.log(req.body, "UUUUUUUUUUUUUUUUUUUUUUUUUUU")
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour
      }
    })
  }
  catch (err){
    res.status(400).json({
      status: "fail",
      message: err


    });
  }
};

 exports.getAllTours = async (req, res) => {
  console.log(req.query,  "Sanjnajnajanjana")
    try{
      // Build Query
      //1.) Filtering
      const queryObj =  { ...req.query };
      const excludedFields = ['page', 'sort', 'limit', 'fields'];
      excludedFields.forEach(el => delete queryObj[el])

      console.log(queryObj, "ujjwalllll")

      //Advanced Filtering
      //basically the filter object looks like 
      // { difficulty: 'easy', duration: { $gte:5 }}  //we need to start new obj whenever we want to use operator

      //Query object ---> from query string (console.log(req.query)) .....[gte]=5&duration=easy
      // {difficulty: 'easy', duration: { gte: '5'}}
  //------------------------------------------------------------------------------------------------
      //we have 2 ways to query the database
      // const tours = await Tour.find({
      //   duration: 5,
      //   difficulty: 'easy'
      // });

      //2. with mongooose method
      //  const tours = await Tour.find()
      //                          .where('duartion')
      //                          .equals(5)
      //                          .where('difficulty')
      //                          .equals('easy')

      const query = Tour.find(queryObj)

      
      //Execute Query
      //const tours = await Tour.find(req.query)
        const tours = await query

//SEND RESPONSE
      res.status(201).json({
        status: "success",
        result: tours.length,
        data: {
          tour: tours
        }
      })

    } catch (err){
      res.status(404).json({
        status: "fail",
        message: err
      });
    }
 }

 exports.getTour = async (req, res) => {
  try{
    //const tour = await Tour.findOne({_id : req.params.id})   //we have to pass afilter object
    const tour = await Tour.findById(req.params.id)
    res.status(201).json({
      status: "success",
      data: {
        tour: tour
      }
    })
  } 
  catch (err){
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
 }

 exports.updateTour = async (req, res) => {
  try{
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    res.status(201).json({
      status: "success",
      data: {
        tour
      }
    })
  }
  catch (err){
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
 }

 exports.deleteTour = async (req, res) => {
  try{
    await Tour.findByIdAndDelete(req.params.id)
    return res.status(204).json({
             status: "success",
             data: null
           });
  }
  catch (err){
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
 }












/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////First Practice when we have to read data from file rather than DB

// const fs = require('fs');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// //we have this middleware before it actually hits the update controller

// exports.checkId = (req, res, next, val) => {
//   console.log(`this is the id : ${val}`);
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       //we have to return from this function if there is no id because if not return then it will send the response back and it then hit the next fun. and will proceed for another response which is not allowed if the response is already sent
//       status: 'fail',
//       message: 'Invalid Id',
//     });
//   }
//   next();
// };

// //create a check body middleware. (Check if body contains the name and price property, if yes
// //then ultimately run the createtourhandler middleware in routes in tourRoutes).
// //Chain this middleware to the post request of createTour handler
// exports.checkBody = (req, res, next) => {
//     console.log(req.body, "SSSSSSSSSSSSSSSSSSSSS")
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       staus: 'fail',
//       message: 'Missing Name or Price',
//     });
//   }
//   next();
//   console.log(
//     req.body.name,
//     '--------------------------AND-------------',
//     req.body.price
//   );
// };

// exports.getAllTours = (req, res) => {
//   //this cb here is called rout handling
//   console.log(req.requestTime, 'Time');
//   res.status(200).json({
//     status: 'success',
//     Time: req.requestTime,
//     result: tours.length,
//     data: {
//       tourss: tours,
//     },
//   });
// };

// exports.getTour = (req, res) => {
//   console.log(req.params.id, '------------------------');
//   const id = req.params.id * 1;
//   const tour = tours.find((el) => el.id === id);
//   console.log(
//     '-------------------------------------------------------------',
//     tour
//   );

//   //if there is no such id present , then
//   //if( id> tours.length)
//   // if(!tour)
//   // {
//   //     return res.status(404).json({
//   //         status: "fail",
//   //         message: "Invalid Id"
//   //     })
//   // }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// };
// exports.createTour = (req, res) => {
//   //here we will use the middleware as express doesnt put that body on the request, so to made that data available will use middleware(app.use(express.json())
//   //console.log(req.body);
//   //as we are gonna to put that body data into the json file here and not into the db so we need to create here id manually:
//   const newId = tours[tours.length - 1].id + 1;
//   //now we will send the body data and the id, so
//   const newTour = Object.assign({ id: newId }, req.body);
//   console.log(newTour, 'Sanjanjanjanja');

//   //now we need to push that created newTour into the tours file so
//   tours.push(newTour);
//   //console.log(tours, "--------------------------------------------------")
//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       res.status(201).json({
//         status: 'success',
//         data: {
//           oneTour: newTour,
//         },
//       });
//     }
//   );

//   //Imp ->        //every time we also need to send some response response
//   //res.send("done")
// };

// exports.updateTour = (req, res) => {
//   // if(req.params.id*1 > tours.length){
//   //     return res.status(404).json({
//   //         status: "fail",
//   //         message: "Invalid Id"
//   //     });
//   // }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: '<updated tour>',
//     },
//   });
// };

// exports.deleteTour = (req, res) => {
//   // if(req.params.id*1 > tours.length){
//   //     return res.status(404).json({
//   //         status: "fail",
//   //         message: "Invalid Id"
//   //     });
//   // }

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// };
