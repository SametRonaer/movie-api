const chai = require('chai');
const chaitHttp = require('chai-http');
const should = chai.should();
const server = require('../app');

chai.use(chaitHttp);

describe('Node-Server' , ()=>{
   it('(Get /) Anasaysayı döndürür' , (done)=>{
       chai.request(server)
           .get('/')
           .end((err , res)=>{
              res.should.have.status(200);
              done();
           });

   });

    it('(Get /) Movies endpoint' , (done)=>{
        done();
    });

});