const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

//Connect to MongoDB Database with Mongoose
mongoose.connect('mongodb://127.0.0.1:27017/dbnoderestapi',{ useNewUrlParser: true });

//Import required Products and Orders Routes
const productsRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');
const usersRoutes = require('./api/routes/users');


//Initialize Logging middleware Morgan
app.use(morgan('dev'));
//Define middleware to handle static files
app.use('/uploads', express.static('uploads'))
//Handle and parse HTTP Requests
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Send Response Headers to fix CORS(Cross Origin Resource Sharing) errors
// app.use((req, res, next) => {
//     res.header("Access-Controll-Allow-Origin", "*");
//     res.header("Origin, X-Requested-With, Content-Type, Authorization, Accept");
//     if (req.method === 'OPTIONS') {
//         res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
//         res.status(200).json({});
//     }
// }); 

//Define imported routes
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);
app.use('/users', usersRoutes);

//Error Handling
app.use((req,res,next)=>{
    const error = new Error("Sorry, resource not found");
    error.status = 404;
    next(error);
})

app.use((error, req,res,next)=>{
    res.status(error.status || 500).json({error:{message:error.message}});
})

app.get('/',(req, res, next) => {
    res.status(200).json({message:"It works"});
});

module.exports = app;