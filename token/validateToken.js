const jwt = require('jsonwebtoken');

module.exports.validateToken = (req,res,next)=>{
    try {
        if(!req.headers.authorization){
            res.status(401)
            res.json({msg:'Token Missing',success:false});
        }else {
            const token = req.headers.authorization.split(' ')[1];
            const decoded_token = jwt.verify(token,'token_key');
            req.uuid = decoded_token.id;
            return next();
        }   
    } catch (error) {
        console.log(error);
        res.status(401);
        res.json({msg:'token expired'});
        return;
    }
}
