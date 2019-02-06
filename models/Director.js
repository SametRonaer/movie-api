const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DirectorSchema = new Schema({
    name: {
        type: String,
        maxlength : 100,
        minlength : 2,
        required : [true , 'Bu alan zorunludur']
    },
    surname: {
        type: String,
        maxlength: 100,
        minlength: 1,
        required : [true , 'Bu alan zorunludur']
    },
    bio: String,
    createdAt :{
        type : Date ,
        default:Date.now()
    }

});

module.exports = mongoose.model('director' , DirectorSchema);