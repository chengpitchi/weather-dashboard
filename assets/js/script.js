var apiKey = '9373c8db95211ae85b982935247ac5be'

var expandIconEl = $('#expand-icon'); 
var historyButtonsEl = $('#history-buttons'); 
var recentSearchText = $('#recent-search-text'); 
var searchButton = $('#search-btn'); 
var recentSearchEl = $('#history-button'); 
var forecast5daysEl = $('#forecast-5days'); 
var currentForcastEl = $('.current-forecast'); 
var cityNameEl = $('input[name=city-name]'); 
var errorMessageEl = $('#error-message'); 

var recentSearchList = new Array(); 

var lat = '0'; 
var lon = '0'; 

function initPage() {
    // get the saved search history in local storage
    recentSearchList = JSON.parse(localStorage.getItem("recentSearch"));
    
    var city = 'Adelaide'; 
    var state = ''; 
    var country = 'Australia'; 

    getGeoCoding(city, state, country, false); 

    renderRecentSearch(); 
}

function renderRecentSearch() {
    //reset the recent search elements
    historyButtonsEl.empty(); 

    if (recentSearchList !== null) {
        // show only 10 recent search results on the screen
        for(let i = 0; i < ((recentSearchList.length < 10) ? recentSearchList.length : 10); i++) {
            let buttonEl = $('<button>')
            buttonEl.addClass('recent-btn button secondary'); 
            buttonEl.attr('type', 'button'); 
            buttonEl.attr('data-city', recentSearchList[i].city); 
            buttonEl.attr('data-state', recentSearchList[i].state);
            buttonEl.attr('data-country', recentSearchList[i].country); 
            buttonEl.attr('data-lat', recentSearchList[i].lat); 
            buttonEl.attr('data-lon', recentSearchList[i].lon); 

            let cityString = ''; 

            (recentSearchList[i].state == '') ?
            cityString = `${recentSearchList[i].city}, ${recentSearchList[i].country}` :
            cityString = `${recentSearchList[i].city}, ${recentSearchList[i].state}, ${recentSearchList[i].country}`; 

            buttonEl.text(cityString);  

            historyButtonsEl.append(buttonEl); 
        }
    }
}

function saveRecentSearch(city, state, country, lat, lon){
    let item = {
        city, 
        state, 
        country, 
        lat, 
        lon
    }     

    if (recentSearchList === null) recentSearchList = new Array(); 

    // add the new item to the beginning of the search result 
    recentSearchList.unshift(item); 

    if (recentSearchList.length > 1) {
        // if there is an existing item in recent search, remove the old one from local storage
        for (var i = 1; i < recentSearchList.length; i++) {
            if (recentSearchList[i].city == item.city && 
                recentSearchList[i].state == item.state &&
                recentSearchList[i].country == item.country) {
                recentSearchList.splice(i, 1); 
                break; 
            }
        }
    }

    localStorage.setItem('recentSearch', JSON.stringify(recentSearchList)); 

    // reload the recent search item
    renderRecentSearch(); 
}

function searchButtonClick(event) {
    event.preventDefault(); 

    var cityName = ''; 
    var state = ''; 
    var country = '';

    var nameArray = cityNameEl.val().trim().split(',');
    
    // separate the city, state and country from the input
    switch (nameArray.length) {
        case 1:
            cityName = nameArray[0].trim(); 
            break; 
        case 2:
            cityName = nameArray[0].trim(); 
            country = nameArray[1].trim(); 
            break; 
        case 3:
            cityName = nameArray[0].trim(); 
            country = nameArray[2].trim(); 
            // only include state if the country is USA or Canada
            if (country == 'USA' || country == 'Canada') state = nameArray[1].trim(); 
            break;
    }

    // rectify the country code of UK to GB
    if (country == 'UK') country = 'GB'; 

    // if it's Autstrlia, remove the state code from the name of the city
    if (country == 'Australia') {
        var tempArr = cityName.split(' '); 
        
        cityName = ''; 
        for (var i = 0; i < tempArr.length - 1; i++) {
            cityName += tempArr[i] + ' '; 
        }

        cityName = cityName.trim(); 
    }

    // get geocode and search the weather
    getGeoCoding(cityName, state, country, true); 
}

function recentSearchClick(event) {
    var btnClicked = $(event.target); 

    if (btnClicked.prop('localName') === 'button') {
        searchWeather(btnClicked.data('city'), 
                        btnClicked.data('state'), 
                        btnClicked.data('country'), 
                        btnClicked.data('lat'), 
                        btnClicked.data('lon'), 
                        false);
        
        window.location.href = '#search-result'; 
    }
}

function searchWeather(cityName, state, country, lat, lon, saveHistory) {
    var requestUrl = 'https://api.openweathermap.org/data/3.0/onecall?lat=' + lat + '&lon=' + lon + '&units=metric&exclude=hourly,minutely&appid=' + apiKey; 
 
    fetch(requestUrl).then(function(response){
        if (response.ok) {
            response.json().then(function(data){  
                // render current day forecast              
                currentForcastEl.empty(); 

                let cityString = ''; 

                (state == '') ?
                cityString = `${cityName}, ${country}` :
                cityString = `${cityName}, ${state}, ${country}`; 

                var cityDateEl = $('<h2>'); 
                cityDateEl.text(cityString + ' (' + moment.utc(data.current.dt + data.timezone_offset, 'X').format("DD MMM YYYY hh:mm A") + ')'); 

                var iconEl = $('<img>'); 
                iconEl.attr('src', 'https://openweathermap.org/img/wn/' + data.current.weather[0].icon + '.png')
                iconEl.attr('alt', 'Weather Icon'); 

                var tempEl = $('<p>'); 
                tempEl.text('Temp: ' + data.current.temp + String.fromCodePoint('8451'));
                
                var windEl = $('<p>'); 
                windEl.text('Wind: ' + data.current.wind_speed + ' MPH');
                
                var humidEl = $('<p>'); 
                humidEl.text('Humidity: ' + data.current.humidity + ' %'); 

                var uvEl = $('<p>'); 
                uvEl.text('UV Index: '); 

                var uvIndexEl = $('<span>'); 
                var uviValue = data.current.uvi.toFixed(2)
                uvIndexEl.text(uviValue); 
                uvIndexEl.attr('id', 'uv-value'); 

                // set the color of uv index
                switch (true) {
                    case (uviValue >= 3 && uviValue < 5.99):
                        var uviColor = 'yellow'; 
                        break; 
                    case (uviValue >= 6 && uviValue < 7.99):
                        var uviColor = 'orange'; 
                        break;
                    case (uviValue >= 8 && uviValue < 10.99):
                        var uviColor = 'red';
                        break;  
                    case (uviValue >= 11):
                        var uviColor = 'purple'; 
                        break; 
                    default:   
                        var uviColor = 'green';                    
                }

                (uviColor == 'yellow') ?
                uvIndexEl.attr('style', 'color:black;background-color:' + uviColor) :
                uvIndexEl.attr('style', 'color:white;background-color:' + uviColor)                

                cityDateEl.append(iconEl); 
                uvEl.append(uvIndexEl); 

                currentForcastEl.append(cityDateEl); 
                currentForcastEl.append(tempEl); 
                currentForcastEl.append(windEl); 
                currentForcastEl.append(humidEl); 
                currentForcastEl.append(uvEl); 
                
                forecast5daysEl.empty(); 

                var startNum = 0; 

                for (var i = 0; i < data.daily.length; i++) {
                    if (moment.utc(data.daily[i].dt + data.timezone_offset, 'X').format("DD MMM YYYY") === moment.utc(data.current.dt + data.timezone_offset, 'X').format("DD MMM YYYY")) {
                        var startNum = i + 1; 
                        break; 
                    }
                }
                
                // render future 5 days weather 
                for (var i = startNum; i < startNum + 5; i++) {
                    var sectionEl = $('<div>'); 
                    sectionEl.addClass('future-forecast'); 

                    var cardEl = $('<div>'); 
                    cardEl.addClass('card-section'); 

                    var dateEl = $('<h3>'); 
                    dateEl.text(moment.utc(data.daily[i].dt + data.timezone_offset, 'X').format("DD MMM YYYY"));

                    var iconEl = $('<img>'); 
                    iconEl.attr('src', 'https://openweathermap.org/img/wn/' + data.daily[i].weather[0].icon + '.png');
                    iconEl.attr('alt', 'Weather Icon'); 

                    var tempEl = $('<p>'); 
                    tempEl.text('Temp: ' + data.daily[i].temp.day + String.fromCodePoint('8451')); 

                    var windEl = $('<p>'); 
                    windEl.text('Wind: ' + data.daily[i].wind_speed + ' MPH'); 

                    var humidEl = $('<p>'); 
                    humidEl.text('Humidity: ' + data.current.humidity + ' %'); 

                    dateEl.append(iconEl); 
                    cardEl.append(dateEl); 
                    cardEl.append(tempEl); 
                    cardEl.append(windEl); 
                    cardEl.append(humidEl); 
                    sectionEl.append(cardEl); 
                    forecast5daysEl.append(sectionEl); 

                    if (saveHistory == true) {
                        saveRecentSearch(cityName, state, country, lat, lon); 
                        window.location.href = '#search-result'; 
                    }

                    cityNameEl.val(''); 
                }
            })
        }
    })
}

function getGeoCoding(city, state, country, saveHistory) {
    var requestUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + ',' + state + ',' + country + '&limit=5&appid=' + apiKey; 

    fetch(requestUrl).then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                if (data.length !== 0) { 
                    lat = data[0].lat.toFixed(2); 
                    lon = data[0].lon.toFixed(2); 
                    city = data[0].name; 
                    if (country == '') country = data[0].country; 

                    searchWeather(city, state, country, lat, lon, saveHistory);
                } else {
                    // display message if the city name cannot be found
                    displayMessage(`The city '${city}' is not existed.  Please try another city.`)
                }
            })
        }
    })
}

function activatePlacesSearch() {
    // auto-complete the city name 
    var options = {types: ['(cities)']};
    var input = document.getElementById('city-name'); 
    var autocomplete = new google.maps.places.Autocomplete(input, options); 
}

function displayMessage(strMessage) {
    // call for displaying the error message 
    errorMessageEl.text(strMessage);  
    errorMessageEl.show(); 

    setTimeout(function(){errorMessageEl.hide()}, 3000); 
}

function expandRecentSearch(event) {
    // function to expand and shrink the recent search section
    event.preventDefault(); 

    if (expandIconEl.data('state') == 'expand') {
        expandIconEl.attr('class', 'fa-solid fa-caret-right'); 
        expandIconEl.data('state', 'shrink'); 
        historyButtonsEl.attr('style', 'display:none'); 
        recentSearchText.attr('style', 'border-bottom:2px solid black'); 
    } else {
        expandIconEl.attr('class', 'fa-solid fa-caret-down'); 
        expandIconEl.data('state', 'expand'); 
        historyButtonsEl.attr('style', 'display:block'); 
        recentSearchText.attr('style', 'border-bottom:none'); 
    }
}

searchButton.click(searchButtonClick); 
expandIconEl.click(expandRecentSearch); 
historyButtonsEl.click('.recent-btn', recentSearchClick); 

initPage(); 
