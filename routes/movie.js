const express = require('express');
const router = express.Router();

//Models

const Movie = require('../models/Movie');




router.get('/between/:start_year/:end_year' , (req ,res)=>{   // Belirli araliktaki filmleri listeleyen route
    const  {start_year ,end_year} = req.params;
    //res.send(start_year+'xxx'+end_year);
    const promise = Movie.find(
        {
            year:{"$gte":parseInt(start_year) , "$lte":parseInt(end_year)} //gte buyukesit gt buyuk ; lte kucukesit lt kucuk anlamina geliyor
        }
    );
    promise.then((data)=>{
       res.json(data);
    }).catch((err)=>{
       res.send(err);
    });
});





router.get('/' , (req , res)=>{
 const promise =  Movie.aggregate([
     {
         $lookup : {                //Join islemi yapiyoruz
             from : 'directors',
             localField: 'director_id',
             foreignField: '_id',
             as: 'director'
         }
     },
     {
         $unwind : '$director'
     }
 ]);

 promise.then((data)=>{                  //Tum filmleri listeleyen route
   res.json(data)
 }).catch((err)=>{
   res.json(err)
 });
});






router.get('/top10' , (req , res)=>{
    const promise =  Movie.find({}).limit(10).sort({imdb_score:-1});

    promise.then((data)=>{                 //top 10 fimi listeleyen route
        res.json(data)
    }).catch((err)=>{
        res.json(err)
    });
});



router.get('/:movie_id' , (req ,res , next)=>{  //Bu sekilde verilen url buraya bir deger gelecek anlamina geliyor
   //res.send(req.params);  // Gonderilen id bu sekilde aliniyor
    const promise = Movie.findById(req.params.movie_id);

    promise.then((movie)=>{       // Verilen id'ye gore film dondurulme route'u
       if(!movie)
           next({message:'The movie was not found' , code : 2345});

       res.json(movie);

    }).catch((err)=>{
       res.send(err);
    });
});



router.delete('/:movie_id' , (req ,res , next)=>{       //Silme route'u

    const promise = Movie.findByIdAndRemove(req.params.movie_id);

    promise.then((movie)=>{
        if(!movie)
            next({message:'The movie was not found' , code : 2345});

        res.json(movie);

    }).catch((err)=>{
        res.send(err);
    });
});



router.put('/:movie_id' , (req ,res , next)=>{  //Guncelleme route'u

    const promise = Movie.findByIdAndUpdate(
        req.params.movie_id ,
        req.body,           //İlki guncelleme yapilacak film ikinci guncellenecek data
        { new: true});

    promise.then((movie)=>{
        if(!movie)
            next({message:'The movie was not found' , code : 2345});

        res.json(req.body);

    }).catch((err)=>{
        res.send(err);
    });
});









router.post('/',(req, res, next) =>{
  //const {title , imdb_score , category , country ,year} =req.body; //Post ile gonderilen datayı bu body nesnesi ile aliyoruz

 /* const movie = new Movie({
    title: title ,
    imdb_score: imdb_score,
    category: category,
    country: country,
    year: year
  });*/

 const movie = new Movie(req.body);  //Yukarıdakinden daha kisa yolu

  /*movie.save((err , data)=>{
    if(err)
      res.json(err);
    res.json(data);
  });
*/
  //Daha temiz bir kod icin Promise yapisini kullaniyoruz

  const promise = movie.save();

  promise.then((data)=>{
    res.json({status : 1});
  }).catch((err)=>{
    res.json(err);
  });


});

module.exports = router;
