let searchInp = document.querySelector('.weather_search')
let city = document.querySelector('.weather_city');
let day = document.querySelector('.weather_day')
let humidity = document.querySelector('.weather_indicator-humidity>.value')
let wind = document.querySelector('.weather_indicator-wind>.value')
let pressure = document.querySelector('.weather_indicator-pressure>.value')
let image = document.querySelector('.weather_image')
let temprature = document.querySelector('.weather_temprature')
let forecastBlock = document.querySelector('.weather_forecast')
let suggestions=document.querySelector('#suggestions')

let weatherAPIKey = 'd4c3a8aefba09b7cf93c189487b1d070';
let forecastBaseEndpoint = 'https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=' + weatherAPIKey;
let weatherBaseEndPoint = 'https://api.openweathermap.org/data/2.5/weather?units=metric&appid=' + weatherAPIKey;
let cityBaseEndpoint=' https://api.teleport.org/api/cities/?search=';
let weatherImages=[
    {
        url:'images/clear-sky.png',
        ids:[800]
    },
    {
        url:'images/broken-clouds.png',
        ids:[803,804]
    },
    {
        url:'images/few-clouds.png',
        ids:[801]
    },
    {
        url:'images/mist.png',
        ids:[701,711,721, 731,741, 751,761,771,781]
    },
    {
        url:'images/rain.png',
        ids:[500,501,502,503,504]
    },
    {
        url:'images/scattered-clouds.png',
        ids:[802]
    },
    {
        url:'images/shower-rain.png',
        ids:[520,521,522,531,300,301,302,310,311,312,313,314,321]
    },
    {
        url:'images/snow.png',
        ids:[511,600,601,602,611,612,613,615,616,620,621,622]
    },
    {
        url:'images/thunderstorm.png',
        ids:[200,201,202,210,211,212,221,230,231,232]
    }
]
const getWeatherByCityName = async (cityString) => {

    let city;
    if(cityString.includes(',')){
        city=cityString.substring(0, cityString.indexOf(',')) 
            + cityString.substring(cityString.lastIndexOf(','))
    } else{
        city=cityString;
    }
    let endPoint = weatherBaseEndPoint + '&q=' + city;

    let response = await fetch(endPoint)
    if (response.status !== 200){
        alert('City not found !')
        return ;
    }
    let weather = await response.json();

    return weather;


}

const getForecatByCityID = async (id) => {

    let endPoint = forecastBaseEndpoint + '&id=' + id;
    let result = await fetch(endPoint)
    let forecast = await result.json();

    let forecastList = forecast.list;
    let daily = [];
    forecastList.forEach(day => {
        let date = new Date(day.dt_txt.replace(' ', 'T'));
        let hours = date.getHours();
        if (hours === 12) {
            daily.push(day)
        }
    })

  return daily;
}
const weatherForCity=async(city)=>{
    let weather = await getWeatherByCityName(city);
        if (!weather){
            return;
        }
        let cityID = weather.id
        updateCurrentWeather(weather)
        let forecast= await getForecatByCityID(cityID)

        updateForecast(forecast)

}
//show default city
const init=()=>{
   
    weatherForCity('Toronto').then(()=>document.body.style.filter='blur(0)')

}
init()
searchInp.addEventListener('keydown', async (e) => {
    //13 is the key enter key code
    if (e.keyCode === 13) {
        weatherForCity(searchInp.value)

    }
})

searchInp.addEventListener('input', async()=>{

    let endpoint= cityBaseEndpoint + searchInp.value;
    let result= await (await fetch(endpoint)).json();
    suggestions.innerHTML='';
    let cities=result._embedded['city:search-results'];
    let length=cities.length>5 ?5 : cities.length;
    for(let i=0; i <length; i++){
        let option=document.createElement('option');
        option.value=cities[i].matching_full_name;
        suggestions.appendChild(option);
    }
    



})
const updateCurrentWeather = (data) => {

    city.textContent = data.name + ', ' + data.sys.country;
    day.textContent = dayOfWeek();
    humidity.textContent = data.main.humidity;
    pressure.textContent = data.main.pressure;
  
    let windDirection;
    let deg = data.wind.deg;
    if (deg > 45 && deg <= 135) {
        windDirection = 'East'
    } else if (deg > 135 && deg <= 225) {
        windDirection = 'South'
    } else if (deg > 225 && deg <= 135) {
        windDirection = 'West'
    } else {
        windDirection = 'North'
    }

    wind.textContent = windDirection + ', ' + data.wind.speed
    temprature.textContent = data.main.temp > 0 ? '+' + Math.round(data.main.temp) + '°C'
        : Math.round(data.main.temp) + '°C';

    let imgId=data.weather[0].id;

    weatherImages.forEach(obj=>{
        if (obj.ids.includes(imgId)){
            image.src=obj.url;
        }
    })

}

const updateForecast = (forecast) => {

    forecastBlock.innerHTML = '';
    forecast.forEach(day => {

        let iconUrl = 'http://openweathermap.org/img/wn/' + day.weather[0].icon + '@2x.png'
        let dayName = dayOfWeek(day.dt * 1000);
        let temprature = day.main.temp > 0 ? '+' + Math.round(day.main.temp)
            : Math.round(day.main.temp);

        let forecastItem = `
            <article class="weather_forecast_item">
                <img src="${iconUrl}" alt="${day.weather[0].description}" class="weather_forecast_icon">
                <h3 class="weather_forecast_day">${dayName}</h3>
                <p class="weather_forecast_temprature"><span class="value">${temprature}</span>&deg;C</p>
            </article>
            `
            forecastBlock.insertAdjacentHTML('beforeend', forecastItem)
    })
}

const dayOfWeek = (dt = new Date().getTime()) => {

    return new Date(dt).toLocaleDateString('en-EN', { 'weekday': 'long' })
}

