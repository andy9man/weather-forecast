class Weather {
    constructor(search) {
        this.search = search;
        this.cityName = '';
        this.cityTempF = '';
        this.cityTempFmin = '';
        this.cityTempFmax = '';
        this.cityTempC = '';
        this.cityTempCmin = '';
        this.cityTempCmax = '';
        this.cityCond = '';
        this.cityCondDefined = '';
        this.cityWind = '';
        this.weatherIcon = '';
    }

    weatherLookup(){
        const apiLink = 'http://api.openweathermap.org/data/2.5/forecast';
        //let city = document.getElementById("iptCity").value;
        console.log("Getting weather information: " + this.search);

        axios.get(apiLink, {
            params: {
            APPID: '341b9c981559718765cdcfba706783db',
            units: 'imperial',
            q: this.search + ',US'
            }
        })
        .then( (data) => {
            console.log(data);
            let today = new Date();
            let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            let dateTime = date+' '+time;
            console.log('Date:  ' + dateTime);
            this.cityName = data.data.city.name;
            this.cityTempF = Math.round( data.data.list[0].main.temp );
            this.cityTempFmin = Math.round( data.data.list[0].main.temp_min );
            this.cityTempFmax = Math.round( data.data.list[0].main.temp_max );
            this.cityTempC = Math.round( (data.data.list[0].main.temp - 32) * (5/9) );
            this.cityTempCmin = Math.round( (data.data.list[0].main.temp_min - 32) * (5/9) );
            this.cityTempCmax = Math.round( (data.data.list[0].main.temp_max - 32) * (5/9) );
            this.cityCondDefined = data.data.list[0].weather[0].description;
            this.cityCond = data.data.list[0].weather[0].main;
            this.cityWind = Math.round( data.data.list[0].wind.speed );
            this.weatherIcon = "http://openweathermap.org/img/w/" + data.data.list[0].weather[0].icon + ".png";
            setWeather(this);
        })
        .catch( (error) => {
            setErrorMessage("An Error has Occured! - " + error.message);
        });
    }
}

function setWeather (weather) {

    document.getElementById("cityName").innerText = weather.cityName;
    document.getElementById("cityTemperature").innerHTML = getTemperature(weather);
    document.getElementById("cityTemperatureMinMax").innerHTML = getMinMaxTemperature(weather);
    document.getElementById("cityWind").innerHTML = "Wind: <b>" + weather.cityWind + " MPH</b>";
    document.getElementById("cityCondition").innerHTML = weather.cityCondDefined
    getWeatherBackground(weather.cityCond);
    document.getElementById("weatherIcon").src = weather.weatherIcon;
    document.getElementById("cityWeatherInformation").style.visibility = "visible";

    setCookie('WeatherForecastSearch', weather.search, 1);
    setStorage(window.localStorage, "WeatherForecastSearch", weather.search);
}

function getTemperature(weather){
    return document.getElementById("tempToggle").checked ? weather.cityTempF + '&deg;F' : weather.cityTempC + '&deg;C';
}

function getMinMaxTemperature(weather){
    let minMaxHtml = '';
    if( document.getElementById("tempToggle").checked ){
        minMaxHtml = "H :  <b>" + weather.cityTempFmax + "&deg;F</b><br>" +
        "L :  <b>" + weather.cityTempFmin + "&deg;F</b>";
    }
    else {
        minMaxHtml = "H :  <b>" + weather.cityTempCmax + "&deg;C</b><br>" +
        "L :  <b>" + weather.cityTempCmin + "&deg;C</b>";
    }
    return  minMaxHtml;
}

function setErrorMessage(message){
    document.getElementById("errorMessage").innerText = message;
}

function setStorage ( storage, key, value) {
    storage.setItem( key, value );
}

function getStorage ( storage, key ){
    return storage.getItem(key);
}

function setCookie(name, value, days){
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = ", expires=" + date.toUTCString() + ";";
    }
    document.cookie = name + "=" + value  + expires;
    console.log("Cookie: " + document.cookie);
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name+'=; Max-Age=-99999999;';
}

function getWeatherBackground( weather ){
    weather = weather.toLowerCase();
    let imageUrl = 'images/';

    switch ( weather ){
        case 'snow':
            imageUrl += weather + '.png';
            break;
        case 'rain':
            imageUrl += weather + '.png';
            break;
        case 'clear':
            imageUrl += weather + '.png';
            break;
        case 'clouds':
            imageUrl += weather + '.png';
            break;
        default:
            document.getElementById("weatherInformation").style.background = "";
    }
    document.getElementById("weatherInformation").style.background = "url('" + imageUrl + "') no-repeat";
    document.getElementById("weatherInformation").style.backgroundSize = "cover";
}

window.onload = () => {

    let weather = undefined;
    let storage = window.localStorage;
    let storageValue = getStorage(storage, "WeatherForecastSearch");
    if( storageValue ) {
        document.getElementById("welcomeMessage").innerHTML = "Welcome Back! We must be awesome - you last searched " + storageValue;

        weather = new Weather(storageValue);
        weather.weatherLookup();
        console.log(weather);
    }
    else {
        document.getElementById("welcomeMessage").innerHTML = "Welcome, glad to have you!";
    }

    console.log( getStorage(storage, 'WeatherForecastSearch') );

    document.getElementById("iptCity").addEventListener('keyup', (e) => {
        if( e.key == "Enter" ) {
            let searchValue = document.getElementById('iptCity').value;
            if(searchValue === undefined){
                setErrorMessage('Please enter a city');
            }
            else{
                weather = new Weather(searchValue);
                weather.weatherLookup();
                document.getElementById("welcomeMessage").innerHTML = "Nice search, why didn't we think of that?!";
                console.log(weather);
            }
        }
    });

    document.getElementById("iptCity").addEventListener('input', (e) => {
        setErrorMessage('');
    });

    document.getElementById("tempToggle").addEventListener('change', (e) => {
        if(weather != undefined){
            setWeather(weather);
        }
    })

    document.getElementById("frmWeather").addEventListener('submit', (e) => {
        e.preventDefault();
    });

    //document.getElementById("weatherIcon").style.visibility = "hidden";
    document.getElementById("cityWeatherInformation").style.visibility = "hidden";
}