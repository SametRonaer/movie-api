const mongoose = require('mongoose');

module.exports = () =>{
    mongoose.connect('mongodb://movie_user:abcd1234@ds145881.mlab.com:45881/movie_api' );

    mongoose.connection.on('open' , ()=>{
        console.log('MongoDb connected :)');
    });
    mongoose.connection.on('error' , (err)=>{
        console.log('MongoDb Error' , err);
    });

    mongoose.Promise = global.Promise;

};