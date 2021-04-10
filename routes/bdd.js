var mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
        useUnifiedTopology : true}

mongoose.connect(`mongodb+srv://admin1:admin1@cluster0.iwwxp.mongodb.net/weatherapp?retryWrites=true&w=majority`,
    options, function(err) {
     console.log(err);} );
   
var citySchema = mongoose.Schema({
        name: String,
        desc: String,
        img: String,
        temp_max: Number,
        temp_min: Number});
       
var cityModel = mongoose.model('savedcities', citySchema);

module.exports = cityModel;