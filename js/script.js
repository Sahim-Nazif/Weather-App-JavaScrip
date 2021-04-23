let searchInp=document.querySelector('.weather_search')
let city= document.querySelector('.weather_city');
let day= document.querySelector('.weather_day')
let humidity=document.querySelector('.weather_indicator-humidity>.value')
let wind=document.querySelector('.weather_indicator-wind>.value')
let pressure=document.querySelector('.weather_indicator-pressure>.value')
let image=document.querySelector('.weather_image')
let temprature=document.querySelector('.weather_temprature')


let weatherAPIKey='d4c3a8aefba09b7cf93c189487b1d070';
let weatherBaseEndPoint='https://api.openweathermap.org/data/2.5/weather?units=metric&appid=' + weatherAPIKey;


let getWeatherByCityName=async (city)=>{

    let endPoint=weatherBaseEndPoint+'&q='+ city;

    let response=await fetch(endPoint)
    let weather=await response.json();

     return weather;
  

}
searchInp.addEventListener('keydown', async(e)=>{
    //13 is the key enter key code
    if (e.keyCode===13){
        let weather=await getWeatherByCityName(searchInp.value)

        updateCurrentWeather(weather)
        console.log(weather)
    }
})

let updateCurrentWeather=(data)=>{

    city.textContent=data.name + ', ' + data.sys.country;
    day.textContent=dayOfWeek();
    humidity.textContent=data.main.humidity;
    pressure.textContent=data.main.pressure;
    let windDirection;
    let deg=data.wind.deg;
    if (deg >45 && deg<=135){
        windDirection='East'
    } else if (deg >135 && deg <=225) {
        windDirection='South'
    } else if (deg >225 && deg <=135) {
        windDirection='West'
    } else{
        windDirection='North'
    }
    
    wind.textContent=windDirection + ', ' +  data.wind.speed
    temprature.textContent=data.main.temp > 0 ? '+' + Math.round(data.main.temp) + '°C'
                            : Math.round(data.main.temp) + '°C';
   
}

let dayOfWeek=()=>{

    return new Date().toLocaleDateString('en-EN', {'weekday': 'long'})
}

