const jwt = require('jsonwebtoken')

module.exports.generateToken = async (user)=>{
    try{
        const token = jwt.sign({id:user._id,email:user.email},process.env.SECRET_KEY,{expiresIn:'24h'});
        return token;
    }
    catch(err){
        throw new Error(`fail to generate the token ${err.message}`)
    }
}