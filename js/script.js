let searchInp=document.querySelector('.weather_search')
let city= document.querySelector('.weather_city');
let day= document.querySelector('.weather_day')
let humidity=document.querySelector('.weather_indicator-humidity>.value')
let wind=document.querySelector('.weather_indicator-wind>.value')
let pressure=document.querySelector('.weather_indicator-pressure>.value')
let image=document.querySelector('.weather_image')
let temprature=document.querySelector('.weather_temprature')
let forecastBlock= document.querySelector('.weather_forecast')

let weatherAPIKey='d4c3a8aefba09b7cf93c189487b1d070';
let forecastBaseEndpoint='https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=' + weatherAPIKey;
let weatherBaseEndPoint='https://api.openweathermap.org/data/2.5/weather?units=metric&appid=' + weatherAPIKey;


const getWeatherByCityName=async (city)=>{

    let endPoint=weatherBaseEndPoint+'&q='+ city;

    let response=await fetch(endPoint)
    let weather=await response.json();

     return weather;
  

}

const getForecatByCityID=async(id)=>{

    let endPoint=forecastBaseEndpoint + '&id=' + id;
    let result= await fetch (endPoint)
    let forecast= await result.json();

    let forecastList=forecast.list;
    let daily=[];
    forecastList.forEach(day=>{
        let date= new Date(day.dt_txt.replace(' ', 'T'));
        let hours=date.getHours();
        if (hours===12){
            daily.push(day)
        }
    })

    console.log(daily)
}
searchInp.addEventListener('keydown', async(e)=>{
    //13 is the key enter key code
    if (e.keyCode===13){
        let weather=await getWeatherByCityName(searchInp.value)
        let cityID=weather.id
        updateCurrentWeather(weather)
        getForecatByCityID(cityID)
        
    }
})

const updateCurrentWeather=(data)=>{

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

const updateForecast=(forecast)=>{

    forecastBlock.innerHTML='';
    forecast.forEach(day=>{

        let iconUrl='http://openweathermap.org/img/wn/' + day.weather[0].icon + '2x.png'
        let day= dayOfWeek(day.dt * 1000);
        
    })
}

const dayOfWeek=(dt= new Date().getTime())=>{

    return new Date(dt).toLocaleDateString('en-EN', {'weekday': 'long'})
}

