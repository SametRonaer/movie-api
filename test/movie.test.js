const chai = require('chai');
const chaitHttp = require('chai-http');
const should = chai.should();
const server = require('../app');

chai.use(chaitHttp);

let token , movieId;

describe('api/movies tests' , ()=>{

    before((done)=>{  //Teste baslamadan yapilacaklari before altında tanimlariz
        chai.request(server)
            .post('/autenticate')
            .send({username : 'Samet2' , password : '123'})
            .end((err , res) =>{
               token = res.body.token;
               //console.log(token);
               done();
            });

    });

    describe('/GET movies' , ()=>{
        it('it should list all the movies' ,(done) =>{
            chai.request(server)
                .get('/api/movies')
                .set('x-access-token' , token)  //header olusturduk
                .end((err ,res)=>{
                   res.should.have.status(200);
                   res.body.should.be.a('array');
                   done();
                });

        });
    });

    describe('/POST movies' , ()=>{
        const movie = {
            title : 'No countrymen',
            imdb_score : '7.6',
            category : 'Action',
            year : '2006',
            director_id: '112'

        };

       it('it should post a movie' , (done)=>{
           chai.request(server)
               .post('/api/movies')
               .send(movie)
               .set('x-access-token' , token)
               .end((err,res)=>{
                  res.should.have.status(200);
                  res.should.be.a('object');
                res.body.should.have.property('title'); //Donen objenin ozelligini kontrol ediyoruz
                   res.body.should.have.property('imdb_score');
                   res.body.should.have.property('category');
                   res.body.should.have.property('year');
                   movieId = res.body._id;

                  done();
               });
       }) ;
    });

    describe('/GET movie id movie' , ()=>{
       it('it should get movies by director id' , (done)=>{
          chai.request(server)
              .get('/api/movies/' + movieId)
              .set('x-access-token' , token)
              .end((err ,res)=>{
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('title'); //Donen objenin ozelligini kontrol ediyoruz
                  res.body.should.have.property('imdb_score');
                  res.body.should.have.property('category');
                  res.body.should.have.property('year');
                  res.body.should.have.property('_id').eql(movieId);
                  done();
              });
       });
    });

    describe('/PUT/:movieId movies' , ()=>{
        const movie = {
            title : 'Crash',
            imdb_score : '5.5',
            category : 'Action',
            year : '2012',
            director_id: '22222'
        };

        it('it should update a movie' , (done)=>{
            chai.request(server)
                .put('/api/movies/'+ movieId)
                .send(movie)
                .set('x-access-token' , token)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.should.be.a('object');
                    console.log(res)
                    res.body.should.have.property('title').eql(movie.title);
                    res.body.should.have.property('director_id').eql(movie.director_id);
                    res.body.should.have.property('imdb_score').eql(movie.imdb_score);
                    res.body.should.have.property('category').eql(movie.category);
                    res.body.should.have.property('year').eql(movie.year);



                    done();
                });
        }) ;
    });

    describe('/DELETE/:movieId movies' , ()=>{
        const movie = {
            title : 'Crash',
            imdb_score : '5.5',
            category : 'Action',
            year : '2012',
            director_id: '22222'
        };

        it('it should delete a movie' , (done)=>{
            chai.request(server)
                .delete('/api/movies/'+ movieId)
                .set('x-access-token' , token)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.should.be.a('object');
                    done();
                });
        }) ;
    });



});