const jwt = require('jsonwebtoken')

module.exports = (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decodedToken;
        next();
    }catch(error){
        res.status(401).json({
            ErrorMessage: "Auth failed"
        })
    }
}

