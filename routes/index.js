const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs'); // sifreleri kriptolu saklayabilmek icin bu modulu kulaniyoruz

const jwt = require('jsonwebtoken');

//Models
const User = require('../models/Users')

router.get('/',(req, res, next) =>{
  res.render('index', { title: 'Express' });
});


router.post('/register',(req, res, next) =>{

  const {username , password} = req.body;

  bcrypt.hash(password ,10).then((hash)=>{

    const user = new User({
      username ,
      password : hash
    });

    const promise = user.save();
    promise.then((data)=>{
      res.json(data);
    }).catch((err)=>{
      res.send(err);
    });

  }).catch((err)=>{
    res.send(err)
  });

});


router.post('/autenticate' , (req , res)=>{
  const {username , password} = req.body;

  User.findOne({
    username
  } , (err , user)=>{
    if (err)
      throw err;
    if (!user){
      res.json({
        status: false,
        message: 'Boyle bir kullanici yok'
      });
    }else{
      bcrypt.compare(password ,user.password).then((result)=>{  // Kriptolu password karsilastirma
        if(!result){
          res.json({
            status: false ,
            message : 'Password eslesmedi'
          });
        }else{
          const payload = {  // Token'a verilecek payload olusturuldu
            username
          };
          const token =jwt.sign(payload , req.app.get('api_secret_key') , {  // Token hashlendi
            expiresIn: 720  // 12 saatlik sure gecerli token (720 dakika)
          });
          res.json({
            status : true ,
            token
          });
        }
      });
    }
  });
});


module.exports = router;
