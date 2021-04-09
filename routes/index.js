var express = require('express');
var router = express.Router();
var request = require('sync-request');

var cityList = []

/* GET weather page. */
router.get('/weather', function(req, res, next) {
  res.render('weather', { cityList });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', {  });
});

/* POST add a city */
router.post('/add-city', function(req, res, next) {

  var result = request("GET", `https://api.openweathermap.org/data/2.5/weather?q=${req.body.newcity}&lang=fr&units=metric&appid=40133caf6b3b044ed3960696e0c0a4e2`);
  var resultAPI = JSON.parse(result.body);

  var alreadyExist = false;

  for(var i=0; i<cityList.length;i++){
    if(req.body.newcity.toLowerCase() == cityList[i].name.toLowerCase() ){
      alreadyExist = true;
    }
  }

  if(alreadyExist == false && resultAPI.name){
    cityList.push({
      name: req.body.newcity,
      desc: resultAPI.weather[0].description,
      img: "http://openweathermap.org/img/wn/"+resultAPI.weather[0].icon+".png",
      temp_min: resultAPI.main.temp_min,
      temp_max: resultAPI.main.temp_max,
    })
  }

  res.render('weather', { cityList });
});

/* GET delete a city */
router.get('/delete-city', function(req, res, next) {
  cityList.splice(req.query.position, 1)
  res.render('weather', { cityList });
});

module.exports = router;
