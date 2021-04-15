var mongoose = require('mongoose')

var citySchema = mongoose.Schema({
    name: String,
    desc: String,
    img: String,
    temp_max: Number,
    temp_min: Number,
    lon: Number,
    lat: Number});
   
var cityModel = mongoose.model('savedcities', citySchema);

module.exports = cityModel;