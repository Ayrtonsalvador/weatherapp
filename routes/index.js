var express = require('express');
var router = express.Router();
var request = require('sync-request');
var cityModel = require('../models/cities');
var userModel = require('../models/users');

/* GET home - login page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

/* GET weather page. */
router.get('/weather', async function(req, res, next) {
  if(!req.session.user){
    res.redirect('/')
  } else { var cityList = await cityModel.find();
  res.render('weather', { cityList });
}
});

/* POST add a city */
router.post('/add-city', async function(req, res, next) {

  var result = request("GET", `https://api.openweathermap.org/data/2.5/weather?q=${req.body.newcity}&lang=fr&units=metric&appid=40133caf6b3b044ed3960696e0c0a4e2`);
  var resultAPI = JSON.parse(result.body);

  var alreadyExist = await cityModel.findOne({ name: req.body.newcity.toLowerCase() });  

  if(alreadyExist == null && resultAPI.name){
    var newCity = new cityModel({
      name: req.body.newcity.toLowerCase(),
      desc: resultAPI.weather[0].description,
      img: "http://openweathermap.org/img/wn/"+resultAPI.weather[0].icon+".png",
      temp_min: resultAPI.main.temp_min,
      temp_max: resultAPI.main.temp_max,
      lon: resultAPI.coord.lon,
      lat: resultAPI.coord.lat,
    });
    
    await newCity.save();
  }

  cityList = await cityModel.find();

  res.render('weather', { cityList });
});

/* GET delete a city */
router.get('/delete-city', async function(req, res, next) {
  await cityModel.deleteOne({ _id: req.query.id } );
  var cityList = await cityModel.find();  
  res.render('weather', { cityList });
});

/* GET update cities' data */
router.get('/update-cities', async function(req, res, next) {

  var cityList = await cityModel.find(); 

  for(var i = 0; i < cityList.length; i++) {
  var result = request("GET", `https://api.openweathermap.org/data/2.5/weather?q=${cityList[i].name}&lang=fr&units=metric&appid=40133caf6b3b044ed3960696e0c0a4e2`);
  var resultAPI = JSON.parse(result.body);

  await cityModel.updateOne(
    {_id: cityList[i].id}, {
      name: cityList[i].name,
      desc: resultAPI.weather[0].description,
      img: "http://openweathermap.org/img/wn/"+resultAPI.weather[0].icon+".png",
      temp_min: resultAPI.main.temp_min,
      temp_max: resultAPI.main.temp_max}
    );
  }
  cityList = await cityModel.find();

  res.render('weather', { cityList });
});

/* POST Register a new user */
router.post('/signup', async function(req, res, next) {

  var searchUser = await userModel.findOne({ email: req.body.email });  
  if(!searchUser) {
    var newUser = new userModel({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    })

    var newUserSaved = await newUser.save()

    req.session.user = {
      name: newUserSaved.name,
      id: newUserSaved._id,}

    console.log(req.session.user)

  res.redirect('/weather') 
} else { res.redirect('/') }
  
});

/* POST Signin a new user */
router.post('/signin', async function(req, res, next) {

  var searchUser = await userModel.findOne({ email: req.body.email,
                                            password: req.body.password });
  if(searchUser!= null) {  
    req.session.user = {
      name: searchUser.name,
      id: searchUser._id
    }

    res.redirect('/weather') 
} else { res.render('login') }
  
});

/*  GET Logout session */
router.get('/logout', function(req,res,next){
  req.session.user = null;
  res.redirect('/')
});

module.exports = router;
