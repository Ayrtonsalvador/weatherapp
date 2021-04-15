var mymap = L.map('mapId').setView([46.6715247, 1.1618433], 5);
  
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

var citiesOnMap = document.getElementsByClassName('list');


for(let i = 0; i < citiesOnMap.length; i++) {
var lon = citiesOnMap[i].dataset.lon
var lat = citiesOnMap[i].dataset.lat
var cityname = citiesOnMap[i].dataset.cityname

console.log(lon, "LON")

L.marker([lat,lon]).addTo(mymap).bindPopup(cityname)

}

