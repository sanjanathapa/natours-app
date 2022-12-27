const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {    //this connect method will return a promise so as usual we need to handle that promise(and this promise here actually gets access to a connection obj)
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(resolvedValue => {
    //console.log(resolvedValue.connections);
    console.log("DB is connected successfuly")
}).catch(err => {
    console.log(`error in connection with database: ${err}`)
})
//console.log(app.get('env'));
//console.log(process.env);
//now to make it(environmt variabled) available to the other file, we need to require a dotenv function
//so we need some way of reading these variables(this is possible thru config func on dotenv) and saving them as
//environmt varibles in our node environment






const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`app is running on the port: ${port}...`));




/////What is mongoose?
//mongoose is an object data modelling library for mongodb and nodejs providing a higher level of abstraction(relationship having like express and node)
//express is a layer of abstraction over regular Node, while mongoose is a layer of abstraction over the regular MongoDB driver.
//and btw, and ODM  is just a way for us to write Javascript code that will then interact with a database.

//we use Mongoose rather than regular mongodb driver as it allows for rapid and simple development of mongodb database interactions.

//Some of the features Mongoose give us is:
//Schemas to model our data and relationship,
//easy data validation, a simple query API, middleware and much more. 

//In mongoose, a schema is where we model our data(where we describe the structure of data, deefault values and validations).
//mongoose model: we then take that schema and create a model out of it. basically model is a wrapper for the schema which provides an interface to the DB for 
//CRUD operations.