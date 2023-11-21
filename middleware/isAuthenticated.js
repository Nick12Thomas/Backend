const jwt = require('jsonwebtoken');
const isAthenticated = async (req,res,next)=>{
    try{
        const authToken = req.headers['authorization'].split(' ')[1];
        
        if(!authToken){
            throw Error('You are not Authenticated');
        }
        
        const decodedToken = jwt.decode(authToken);

        req.body.userId = decodedToken._id;
        next();
    }catch(e){
        res.status(401).json({
            message:e.message || 'You are not Authorized'
        })
    }
} 

module.exports = isAthenticated;