const jwt = require('jsonwebtoken');

module.exports = (req ,res ,next)=>{
  const token = req.headers['x-access-token'] || req.body.token || req.query.token ;  //query get ile gonderilen tokenları almak icin
   // console.log('Token= '+token);
    if(token){
    jwt.verify(token , req.app.get('api_secret_key') , (err ,decoded)=>{
        if(err){

            res.json({
               staus: false ,
               message : 'this token is not available'
            });
        }else{
            req.decode = decoded ;
           // console.log(decoded);
            next();
        }
    });
    }else{
        res.json({
           status : false ,
           message : 'Boyle bir token yok'
        });
    }

};