//send the token back to server to access protected routes via authetication
//Passport middleware for twitter / fb login

const jwt = require('jsonwebtoken');
const config = require('config');

//next is to move on to the next middleware
module.exports = function(req, res, next){
    //Get token from headers
    const token = req.header('x-auth-token');

    //check if not token
    if(!token){
        return res.status(401).json({msg : 'No token authorization denied'})
    }

    //Verify token
    try{
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        //if decoded token is verified, set the req user to the user in decoded token object. Can use the req.user for accessing protected routes and viewing profile infos, etc
        req.user = decoded.user;
        next();
    }
    catch(err){ 
        res.status(401).json({msg: 'Token is not valid'});
    }
}