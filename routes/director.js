const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//Models
const Director = require('../models/Director');


router.post('/',(req, res, next) =>{              // Yonetmen kaydetme route'u
  const director = new Director(req.body);
  const promise = director.save();
  promise.then((director)=>{
    res.json(director);
  }).catch((err)=>{
    res.json(err);
  });
  //res.json({ title: 'Express' });
});


router.get('/' , (req ,res)=>{
  const promise = Director.aggregate([
    {
      $lookup:{
        from: 'movies',     // hangi collectionla join islemi yapilacak
        localField:'_id',   // Director collection'daki eslesecek kisim
        foreignField:'director_id' ,//movies kismindaki eslesecek kisim
        as: 'movies'          //Donen datanin atanacagi degisken
      }
    },{
    $unwind:{
      path: '$movies',
      preserveNullAndEmptyArrays: true //Herhangi bir datayla eslesmese bile butun yonetmenlerin listelenmesi icin true degerini verdik
    }
    },{
    $group:{        // Toplu halde gorunmeleri icin gruplama islemi yaptik
      _id:{
        _id : '$_id',
        name: '$name',
        surname: '$surname',
        bio: '$bio'
      },
      movies:{     // Yonetmenin butun filmlerini movies degiskenine push ettik toplu halde gormek icin
        $push: '$movies'
      }
    }
    },{
    $project:{    // Gruplamanin basinda bu bilgiler yazmasini ayarladik
      _id : '$_id._id',
      name: '$_id.name',
      surname: '$_id.surname',
      movies:'$movies'
    }
    }
  ]);

  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });

});




router.get('/:director_id' , (req ,res)=>{  //Belirli bir directorun bilgisini listelemek
    const promise = Director.aggregate([
        {
          $match: {
                '_id': mongoose.Types.ObjectId(req.params.director_id)  // Gonderilen degeri karsilastirma yapabilmek icin objectId tipine cevirdik
          }
        },
        {
            $lookup:{
                from: 'movies',     // hangi collectionla join islemi yapilacak
                localField:'_id',   // Director collection'daki eslesecek kisim
                foreignField:'director_id' ,//movies kismindaki eslesecek kisim
                as: 'movies'          //Donen datanin atanacagi degisken
            }
        },{
            $unwind:{
                path: '$movies',
                preserveNullAndEmptyArrays: true //Herhangi bir datayla eslesmese bile butun yonetmenlerin listelenmesi icin true degerini verdik
            }
        },{
            $group:{        // Toplu halde gorunmeleri icin gruplama islemi yaptik
                _id:{
                    _id : '$_id',
                    name: '$name',
                    surname: '$surname',
                    bio: '$bio'
                },
                movies:{     // Yonetmenin butun filmlerini movies degiskenine push ettik toplu halde gormek icin
                    $push: '$movies'
                }
            }
        },{
            $project:{    // Gruplamanin basinda bu bilgiler yazmasini ayarladik
                _id : '$_id._id',
                name: '$_id.name',
                surname: '$_id.surname',
                movies:'$movies'
            }
        }
    ]);

    promise.then((data)=>{
        res.json(data);
    }).catch((err)=>{
        res.json(err);
    });

});



router.put('/:director_id' , (req ,res , next)=>{  //Guncelleme route'u

    const promise = Director.findByIdAndUpdate(
        req.params.director_id ,
        req.body,           //İlki guncelleme yapilacak film ikinci guncellenecek data
        { new: true});

    promise.then((director)=>{
        if(!director)
            next({message:'The director was not found' , code : 2345});

        res.json(director);

    }).catch((err)=>{
        res.json(err);
    });
});


router.delete('/:director_id' , (req ,res , next)=>{       //Silme route'u

    const promise = Director.findByIdAndRemove(req.params.director_id);

    promise.then((director)=>{
        if(!director)
            next({message:'The movie was not found' , code : 2345});

        res.json(director);

    }).catch((err)=>{
        res.send(err);
    });
});




module.exports = router;
