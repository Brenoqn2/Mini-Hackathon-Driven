const userLocation = { latitude: null, longitude: null, city: '' };
const API_KEY = '6746533522088dab97f9e2becc06d737';

function init() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setLocationUser, showError);
  } else {
    alert('Navegador não suporta Geolocalização!');
  }
}

function setLocationUser(position) {  
  if (position.coords) {
    userLocation.latitude = position.coords.latitude;
    userLocation.longitude = position.coords.longitude;
    getWeatherByGeolocation();
  }
}

function setLocationUserByInput() {
  const inputValue = document.querySelector('input');

  if (inputValue) {
    const value = inputValue.value;
    userLocation.city = value;
    getWeatherByCity();
  }
}

function showError(err) {
  alert('Erro ao obter localização!');
  console.log('Erro ao obter localização.', err);
}

function getWeatherByGeolocation() {
  const { latitude, longitude } = userLocation;

  if (latitude && longitude) {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
    
    const promise = axios.get(API_URL);
    promise.then((req) => insertDataInHTML(req.data))
    promise.catch(() => alert("Ocorreu um erro na requisição."));
  } else {
    alert('Por favor, insira uma localização.');
  }
}

function getWeatherByCity() {
  const { city } = userLocation;

  if (city) {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;

    const promise = axios.get(API_URL);
    promise.then((res) => insertDataInHTML(res.data));
    promise.catch(() => alert('Ocorreu um erro na requisição.'));
  } else {
    alert('Por favor, insira o nome da cidade, ex.: São Paulo, Belo Horizonte, etc...');
  }
}

function insertDataInHTML(data) {
  const main = document.getElementsByTagName('main')[0];
  const icon = main.querySelector('img');

  icon.setAttribute('src',`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);

  const status = document.getElementsByClassName('statusWeather')[0];
  const temperature = document.getElementsByClassName('temperature')[0];
  const feelsLikeTemperature = document.getElementsByClassName('feelsLikeTemperature')[0];
  const nav = document.getElementsByTagName('nav')[0];
  const location = nav.getElementsByTagName('input')[0];

  status.innerHTML = data.weather[0].main;
  temperature.innerHTML = `${convertKelvinToCelsius(data.main.temp)}°`;
  feelsLikeTemperature.innerHTML = `Feels like Temperature: ${convertKelvinToCelsius(data.main.feels_like)}°`

  location.value = data.name;
}

function convertKelvinToCelsius(temperature) {
  return Math.round(temperature - 273);
}

init();