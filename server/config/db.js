//Connetion logic
const mongoose = require('mongoose');
//import the config file which has the mongoUri connection string 
const config = require('config');
//extract the key from config file and store it in loc var db
const db = config.get('mongoURI');

//Connect to mongodb - main logic
const connectDB = async () => {
    try{
        await mongoose.connect(db, 
            // Add the below objects are there to avoid mongoose depriction warnings
            {useNewUrlParser: true,
             useUnifiedTopology: true,
             useCreateIndex: true
             }
            );
        console.log('Mondodb connected');
    }
    catch(err){
        console.error(err);
        //EXIT process with a failure
        process.exit(1);
    }
}

//Export the connection file
module.exports = connectDB