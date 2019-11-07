//import express
const express = require('express');
//use /invoke express
const app = express();
//Client's get request is returned here by express
// app.get('/', (req, res) => res.send('API Running on test server'));

//Declare the port where backend will run
const PORT = process.env.PORT || 5000;

app.use(function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    //Pass the next layer of middleware
    next();
})
//Pass the test.html into the server and run from there
app.get('/', (req, res) => res.sendFile(__dirname + '/test.html'));

app.get('/home', (req, res) => res.send({msg:'New Home Message'}));

//App listen to the port
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));