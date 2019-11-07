//import express
const express = require('express');

//Import the connection file
const connectionDB = require('./config/db');

//use /invoke express
const app = express();

//Connect to database
connectionDB();

//GET DATA IN REQ.BODY While doing a POST
////INIT a middleware
//Use middleware after connecting database to the server
app.use(express.json({extended: false}));

//Client's get request is returned here by express
app.get('/', (req, res) => res.send('API Running'));

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

//Declare the port where backend will run
const PORT = process.env.PORT || 5000;

//App listen to the port
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));