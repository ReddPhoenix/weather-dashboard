function date() {
    var dateHeader = moment().format('MMMM Do, YYYY');
    $('#currentDay').text(dateHeader);
}

// Date function called
date();


// Weather variables
// var button = document.querySelector('.button')
// var inputValue = document.querySelector('.inputValue')
// var name = document.querySelector('.name');
// var desc = document.querySelector('.desc');
// var temp = document.querySelector('.temp');
// var humid = document.querySelector('.humid');
// var wind = document.querySelector('.wind');
// var uv = document.querySelector('uv');

// Weather link test
// let weather = 'https://api.openweathermap.org/data/2.5/weather?zip=84412,us&appid=d3dee878f6d8c661981e257c21fdc6b5'
// console.log(weather);

// Click listener to fetch weather from API
// button.addEventListener('click', function () {
//     fetch('https://api.openweathermap.org/data/2.5/weather?q=' + inputValue.value + '&appid=d3dee878f6d8c661981e257c21fdc6b5')
//     .then(response => response.json())
//     .then(data => {
//         var nameValue = data['name'];
//         // var nameValue = data['name'];

//         var tempValue = data['main']['temp'];
//         // Temperature converted from Kelvin to Farenheit
//         var tempValue = Math.round(tempValue * 1.8 - 459.67);
//         var descValue = data['weather'][0]['description'];
//         var humidValue = data['main']['humidity'];
//         var windValue = data['wind']['speed'];


//         name.innerHTML = "City: " + nameValue;
//         // &#176; produces degree sign
//         temp.innerHTML = "Temperature: " + tempValue + "&#176;";
//         desc.innerHTML = "Conditions: " + descValue;
//         name.innerHTML = nameValue + "testing";
//         humid.innerHTML = "Humidity: " + humidValue + "%";
//         wind.innerHTML = "Wind Speed: " + windValue + " MPH"



//         console.log(inputValue);
//         console.log(nameValue);
//         console.log(tempValue);
//         console.log(descValue);
//         console.log(humidValue);
//         console.log(windValue);
//     })

//     // In case of misspelled city name an alert occurs
//     .catch(err => alert('Wrong city name!'))
// })



$(document).ready(function () {

    var cityStored = [];


    // Function to make the call and display current weather 

    function displayWeather(city) {

        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + "d3dee878f6d8c661981e257c21fdc6b5" + "&units=imperial";

        // OpenWeatherMap API information retrival
        $.ajax({
                url: queryURL,
                method: "GET"
            })
            // Store retrieved data inside of an object called "response"
            .then(function (response) {

                $(".weather-info").empty();
                $(".condition-image").empty();

                var weatherInfo = $(".weather-info");
                var tempResponse = response.main.temp;
                // String.fromCharCode(176) used to produce degree symbol when using jQuery
                var temperature = $("<div>").text("Temperature: " + Math.round(tempResponse) + String.fromCharCode(176));
                var humidityResponse = response.main.humidity;
                var humidity = $("<div>").text("Humidity: " + humidityResponse + "%");
                var windResponse = response.wind.speed;
                var wind = $("<div>").text("Wind Speed: " + Math.round(windResponse) + " MPH");
                var iconcodeCurrent = response.weather[0].icon
                var iconurlCurrent = "http://openweathermap.org/img/w/" + iconcodeCurrent + ".png";

                // Added data to card
                weatherInfo.append(temperature)
                weatherInfo.append(humidity);
                weatherInfo.append(wind);
                $(".condition-image").append('<img src="' + iconurlCurrent + '" />');


                // UV Index obtained through second query using latitude & longitude
                // Error when accessing despite correct coordinates on console log
                var uvURL = "https://api.openweathermap.org/data/2.5/uvi?d3dee878f6d8c661981e257c21fdc6b5&lat=" + response.coord.lat + "&lon=" + response.coord.lon;
                console.log(uvURL);
                $.ajax({
                    url: uvURL,
                    method: "GET"

                }).then(function (uvresponse) {
                    var uvindex = uvresponse.value;
                    var uvColor;
                    if (uvindex <= 3) {
                        uvColor = "green";
                    } else if (uvindex >= 3 || uvindex <= 6) {
                        uvColor = "yellow";
                    } else if (uvindex >= 6 || uvindex <= 8) {
                        uvColor = "orange";
                    } else {
                        uvColor = "red";
                    }
                });

            });
    }

    // Saved cities in localstorage
    // Do not use session storage

    function displayCities(newCity) {
        $(".city-card").empty();
        localStorage.setItem("searchedCity", JSON.stringify(cityStored))

        // Add city
        for (var i = 0; i < cityStored.length; i++) {
            var cityName = $("<p>");
            cityName.addClass("new-city-p");
            cityName.attr(cityStored[i]);
            cityName.text(cityStored[i]);
            $(".city-card").append(cityName);
        }
    }


    // Function to display 5-day forecast temperatures calling OpenWeather:

    function fiveDayForecast(inputCity) {
        var queryTemp = "https://api.openweathermap.org/data/2.5/forecast?q=" + inputCity + "&APPID=" + "d3dee878f6d8c661981e257c21fdc6b5" + "&units=imperial";
        var queryConditionImage =

            // Run AJAX call to the OpenWeatherMap API
            $.ajax({
                url: queryTemp,
                method: "GET"
            })
            .then(function (responseTemp) {
                $(".forecastCards").empty();

                for (var i = 0; i < 5; i++) {

                    var forecastDate = responseTemp.list[i].dt_txt.slice(0, 10);
                    var forecastTemp = responseTemp.list[i].main.temp;
                    var forecastHumidity = responseTemp.list[i].main.humidity;
                    var iconcode = responseTemp.list[i].weather[0].icon;
                    var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";

                    var cardContent =
                        // Date staying the same
                        "<div class='col-sm-2 cardDay'><p class='dateForecast'>" +
                        forecastDate +
                        "</p><p>" +
                        '<img src="' + iconurl + '" />' +
                        "</p><p>" +
                        "Temperature: " +
                        Math.round(forecastTemp) +
                        "&#176;" +
                        "</p><p>" +
                        'Humidity: ' +
                        forecastHumidity +
                        '%' +
                        "</p></div>";
                    $(".forecastCards").append(cardContent);
                }
            })
    }



    // Search button
    $("#search-button").on("click", function (event) {
        event.preventDefault();
        var inputCity = $("#city-input").val().trim();
        cityStored.push(inputCity);
        $(".city").text((inputCity))
        var todayDate = $('.today-date');
        $(todayDate).text("(" + (moment().format('MMMM Do, YYYY')) + ")")


        var fiveDayText = $('#five-days')
        $(fiveDayText).text("Five Day Forecast: ")

        displayWeather(inputCity);
        displayCities(inputCity);
        fiveDayForecast(inputCity)

    });

    // Saved Cities click to recall
    $(".city-card").on("click", ".new-city-p", function (event) {
        event.preventDefault();
        $(".city").text(event.currentTarget.innerText);
        displayWeather(event.currentTarget.innerText);
    })
});