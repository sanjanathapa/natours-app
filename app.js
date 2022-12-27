const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');


const app = express();
app.use(express.json());  //calling json method here basically returns a function, that func is then added to the middleware stack


///////////////////////////////////////Creating our own middleware/////////////////////////////////////////
app.use((req, res, next) => {
    console.log("Hello from middleware");
    next();
});

//now we will manipulate the req object---adding current time to the request(simply define a property on the req obj
//and can then use that on any route handler to manipulate the req obj)
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});


/////using third  party middleware
if(process.env.NODE_ENV === 'development'){
app.use(morgan('dev'))};  //calling this morgan function in return, returns the function thatj looks like a middleware func(that it should like be)

// app.get('/', (req, res) => {
//     res.status(200);
//     res.send('hii from the server'); 
// });
// //we can also send the response in the json format by just defining res.json

// app.post('/', (req, res) => {
//     res.json({message :"hello from the server side on the post request", app:"Natours"})
// })


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////Refactoring the Code ///separating the handler functions of the routes so that we can even export to other file
// const getAllTours = (req, res) => {  //this cb here is called rout handling
//     console.log(req.requestTime, "Time")
//     res.status(200).json({
//         status: "success",
//         Time: req.requestTime,
//         result: tours.length,
//         data: {
//             tourss: tours
//         }
//     });
// };

// const getTour = (req,res) => {
//     console.log(req.params.id, "------------------------");
//     const id = req.params.id*1
//     const tour = tours.find(el => el.id === id );
//     console.log("-------------------------------------------------------------", tour)

//     //if there is no such id present , then
//     //if( id> tours.length)
//     if(!tour)
//     {
//         return res.status(404).json({
//             status: "fail",
//             message: "Invalid Id"
//         })
//     }
//     res.status(200).json({
//         status: "success",
//         data : {
//             tour
//         }
//     })
// }
// const createTour = (req, res) =>{      //here we will use the middleware as express doesnt put that body on the request, so to made that data available will use middleware(app.use(express.json())
//     //console.log(req.body);
//     //as we are gonna put that body data into the json file here and not into the db so we need to create here id manually:
//     const newId = tours[tours.length - 1].id + 1;
//     //now we will send the body data and the id, so
//     const newTour = Object.assign({id: newId}, req.body)
//     console.log(newTour, "Sanjanjanjanja");

// //now we need to push that created newTour into the tours file so
// tours.push(newTour);
// //console.log(tours, "--------------------------------------------------")
// fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
// res.status(201).json({
//     status: "success",
//     data : {
//         oneTour: newTour
//     }
// })
// })

// //Imp ->  //every time we also need to send some response response 
//     //res.send("done")
// };

// const updateTour = (req,res) => {
//     if(req.params.id*1 > tours.length){
//         return res.status(404).json({
//             status: "fail",
//             message: "Invalid Id"
//         });
//     }

//     res.status(200).json({
//         status: "success",
//         data: {
//             tour: "<updated tour>"
//         }
//     })
// }

// const deleteTour = (req,res) => {
//     if(req.params.id*1 > tours.length){
//         return res.status(404).json({
//             status: "fail",
//             message: "Invalid Id"
//         });
//     }

//     res.status(204).json({
//         status: "success",
//         data: null
//     })
// }

//////////////////////////////////////////////////////////////////////////Users

// const getAllUsers = (req, res) => {
//     res.status(500).json({
//         status: "error",
//         message: "This route is not defined yet"
//     })
// };

// const getUsers = (req, res) => {
//     res.status(500).json({
//         status: "error",
//         message: "This route is not defined yet"
//     })
// };

// const createUser =  (req, res) => {
//     res.status(500).json({
//         status: "error",
//         message: "This route is not defined yet"
//     })
// };

// const updateUsers = (req, res) => {
//     res.status(500).json({
//         status: "error",
//         message: "This route is not defined yet"
//     })
// };

// const deleteUsers = (req, res) => {
//     res.status(500).json({
//         status: "error",
//         message: "This route is not defined yet"
//     })
// };

//we will first read the file as a top level code and we dont want to block the code inside the folloeing cb function so
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));
//console.log("Sanjana", tours)
//app.get('/api/v1/tours', getAllTours);

////////////////////////////////////////////////////////////////////////////////////////////
//Responding to URL parameters
//we need to define a route which can accept a variable(params)
// app.get('/api/v1/tours/:id', getTour )
// app.post('/api/v1/tours', createTour)
// app.patch('/api/v1/tours/:id', updateTour)
// app.delete('/api/v1/tours/:id', deleteTour)

//another method doing this using route is
//app.route('/api/v1/tours').get(getAllTours).post(createTour);

//as the order of middleware is matters as(what will happen here is the following console will not be logged as the 
//upper route handler finished its req-res cycle part of the middleware stack that gets executed before the req-res 
//cycle ends)
// app.use((req, res, next) => {
//     console.log("Hello from middleware");
//     next();
// });

//app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour)

////////////////////////////////////////////////////////////////////////////////////////
////Implementing the User routes
// app.route('/api/v1/users').get(getAllUsers).post(createUsers);
// app.route('/api/v1/userss/:id').get(getUsers).patch(updateUsers).delete(deleteUsers)


/////Mounting the tourRouter and userRouter

//const userRouter = express.Router();

// userRouter.route('/').get(getAllUsers).post(createUser)
// userRouter.route('/:id').get(getUsers).patch(updateUsers).delete(deleteUsers)


app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter)


//Most used API architecture: (Representational States Transfer is basically a way of building web APIs in a logical 
//way, making them easy to consume)
//API : is piece of software  that can be used by another piece of software in order to allow application to talk to 
//each other.

//Restful APIs ->which means APIs following the REST architecture, and that rules are:-
//1. Separate API into logical resources.
//2. These resources should then be exposed(to be made available using structures, resource-based URLs).
//3. use HTTP methods for doing any action on data(deleting, creating etc).
//4. Send data as JSON(from server to client or vice versa)(usually).
//5. The APIs must be stateless(i.e all states must be handled on the client ans not on the server. And state simply 
//refers to a piece of data in the app that might change over the time)



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////


module.exports = app;


/////
//Node js app and express app can run in different environments. and the most imp ones are the development env and production env./becs depending on the env, we might use different DB.
//now by defauly, express sets the environment to development.
//in summary env variables are global variables that are used to define the environment in which a node app is running

//process.env //nodejs also sets a lot of env varibaled