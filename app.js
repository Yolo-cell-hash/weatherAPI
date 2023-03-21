const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static("public"));
const https=require('https');

var cityName='';
var longitude='';
var latitude='';
var description='';
var sunrise='';
var sunset='';
var temperature='';
var pressure='';
var snow='';
var rain
var precipitation='';
var humidity='';
var windSpeed='';
var windDegree='';
var clouds='';
var visibility='';

var co="";
var no="";
var o3="";
var no2='';
var so2='';
var pm2_5='';
var pm10='';
var nh3='';


app.get('/',function(req,res){
  res.render('home');
 });

app.post('/',function(req,res){
  cityName=req.body.cityName;

  if(cityName.length===0){
    res.render('404')
  }else{
    const api_url= 'https://api.openweathermap.org/data/2.5/weather?q='+ cityName +'&appid=8bb235e1990db4b5ae16f92e920bad25';
    https.get(api_url,function(output){
   
     output.on('data', function(data){
      const weatherData= JSON.parse(data);
   
      // GENERAL
      longitude=(weatherData.coord.lon);
      latitude=(weatherData.coord.lat);
      description=(weatherData.weather[0].description);
      sunrise= Number(weatherData.sys.sunrise);
      sunset=Number(weatherData.sys.sunset);
  
      let dateObj1 = new Date(sunrise * 1000);
      let utcString1 = dateObj1.toUTCString();
      let sunriseSTD = utcString1.slice(-11, -4);
      
      let dateObj = new Date(sunset * 1000);
      let utcString = dateObj.toUTCString();
      let sunsetSTD = utcString.slice(-11, -4);
  
  
      // WEATHER
       temperature=Number(weatherData.main.temp)-273.15;
       pressure= Number(weatherData.main.pressure);
       rain= Number(weatherData.rain);
       snow= Number(weatherData.snow);
       precipitation = Number(weatherData.precipitation);
       humidity=Number(weatherData.main.humidity);
  
      // WINDS & VISIBILITY
       windSpeed=Number(weatherData.wind.speed);
       windDegree= Number(weatherData.wind.deg);
       visibility=Number((weatherData.visibility)/1000)*10;
       clouds=Number(weatherData.clouds.all);
  
      const api_air_pollution_url="https://api.openweathermap.org/data/2.5/air_pollution?lat="+latitude+"&lon="+longitude+"&appid=8bb235e1990db4b5ae16f92e920bad25"
      https.get(api_air_pollution_url,function(out){
        // console.log(out);
      
        out.on('data', function(data){
         const pollutionData= JSON.parse(data);
  
         co=pollutionData.list[0].components.co;
         no=pollutionData.list[0].components.no;
         no2=pollutionData.list[0].components.no2;
         o3=pollutionData.list[0].components.o3;
         so2=pollutionData.list[0].components.so2;
         pm2_5=pollutionData.list[0].components.pm2_5;
         pm10=pollutionData.list[0].components.pm10;
         nh3=pollutionData.list[0].components.nh3;
  
        res.redirect('/results');
  
        });
     });
    });
  }); 
  }
});

app.get('/results',function(req,res){
  res.render('results',{
    cityName: cityName,
    latitude:latitude,
    longitude:longitude,
    sunrise:sunrise,
    sunset:sunset,
    pressure:pressure,
    precipitation:precipitation,
    snow:snow,
    temperature:temperature,
    rain:rain,
    humidity:humidity,
    windSpeed:windSpeed,
    windDegree:windDegree,
    clouds:clouds,
    visibility:visibility,
    co:co,
    no:no,
    no2:no2,
    o3:o3,
    nh3:nh3,
    pm2_5:pm2_5,
    pm10:pm10,
    so2:so2,
  });
  });

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function(){
  console.log("Server ativated at port successfully");
});