var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String});
   
var userModel = mongoose.model('registeredusers', userSchema);

module.exports = userModel;