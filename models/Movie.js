const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    director_id: Schema.Types.ObjectId,

    title:{
        type: String,
        required:[true , '"{PATH}" alanı zorunludur.'], //Validasyon islemleri yapiliyor
        maxlength :[15, '{PATH} ({VALUE}) degeri ({MAXLENGTH}) degerinden buyuk olamaz'],
        minlength : 2
    },
    category: {
        type: String,
        maxlength: 20,
        minlength: 2

    },
    country: String ,
    year: {
        type:Number,
        max: 2019,
        min: 1900
    } ,
    imdb_score: {
        type:Number,
        max: 10 ,
        min : 0
    },
    director_id : Number,
    createdAt:{
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('movie' , MovieSchema);