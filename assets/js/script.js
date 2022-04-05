var cityInputEl = document.querySelector("#city");
var searchFormEl = document.querySelector("#search-form");
var cityContainerEl = document.querySelector("#cards-container");
var historyEl = document.querySelector("#search-history");


var searchHistory = function(city) {
    // create a container for each repo
    var searchbtn = document.createElement("button");
    searchbtn.classList = "search-btn list-item flex-row justify-content-center align-center";
    searchbtn.innerText = city;

    historyEl.appendChild(searchbtn);
};


// function to turn the city name into geo locations: latitude and longitude
var getCityCoordinates = function(city) {
    // format the Open Weather api Url
    var geoUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + ",US&limit=1&appid=29db0ef107ead191a2ff9df42aa1bce2"
    
    // make a request to the url
    fetch(geoUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
        response.json().then(function(data) {
            console.log(data, city);
            var lat = data[0].lat;
            var lon = data[0].lon;
            var state = data[0].state;
            console.log(lat);
            console.log(lon);
            console.log(city);
            console.log(state)
            getWeather(lat, lon, city, state);
        });
        } else {
            alert("Error: City Not Found");
        }
    })
    .catch(function(error) {
        // Notice this '.catch()' getting chained onto the end of the '.then()' method
        alert("Unable to connect to OpenWeather");
    });
};


var getWeather = function(lat, lon, city, state) {
    // format the Open Weather api Url
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=29db0ef107ead191a2ff9df42aa1bce2";
    // make a request to the url
    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
        response.json().then(function(data) {
            console.log(data);
            console.log(city);
            currentWeatherCard(data, city, state);
            futureWeatherCard(data, city, state);
        });
    } else {
        alert("Error: Geocoding.")
        }
    })
    .catch(function(error) {
        // Notice this '.catch()' getting chained onto the end of the '.then()' method
        alert("Unable to connect to OpenWeather");
    });
};


var currentWeatherCard = function(data, city, state) {
    // create city card
    var cityEl = document.createElement("div");
    cityEl.classList = "card col-5 col-md-3 col-lg-2 shadow border border-dark card-group";
    
    // get image icon from data and append to card
    var imgEl = document.createElement("img");
    var icon = data.current.weather[0].icon;
    imgEl.classList = "card-img-top";
    imgEl.src = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

    cityEl.appendChild(imgEl);

    var cardBodyEl = document.createElement("div");
    cardBodyEl.classList = "card-body";

    cityEl.appendChild(cardBodyEl);

    var cardTitleEl = document.createElement("h5");
    cardTitleEl.classList = "card-title";
    cardTitleEl.textContent = city + ", " + state;

    var dateEl = document.createElement("p");
    dateEl.classList = "card-text";
    var unix = data.current.dt;
    var momentDate = moment.unix(unix).format("dddd, MMMM Do, LT");
    dateEl.textContent = momentDate;

    cardBodyEl.appendChild(cardTitleEl);
    cardBodyEl.appendChild(dateEl);

    createCardList(data, cityEl);

   
    // append the card to the main body
    cityContainerEl.appendChild(cityEl);

};


var createCardList = function(data, cityEl) {
    var listGroup = document.createElement("ul");
    listGroup.classList = "list-group list-group-flush";

    var tempEL = document.createElement("li");
    tempEL.classList = "list-group-item";
    tempEL.innerText = "Temp: " + data.current.temp + "°F";
    listGroup.appendChild(tempEL);

    var humidityEl = document.createElement("li");
    humidityEl.classList = "list-group-item";
    humidityEl.innerText = "Humidity: " + data.current.humidity + "%";
    listGroup.appendChild(humidityEl);

    var windEl = document.createElement("li");
    windEl.classList = "list-group-item";
    windEl.innerText = "Wind Speed: " + data.current.wind_speed + "mph";
    listGroup.appendChild(windEl);

    var uvEl = document.createElement("li");
    var UV = data.current.uvi
    uvEl.innerText = "UV Index: " + UV;
    // change UV Index color due to intensity
    if (UV <= 4) {
        uvEl.classList = "uv-light list-group-item";
    } else if (UV > 4 && UV < 8) {
        uvEl.classList = "uv-moderate list-group-item";
    } else {
        uvEl.classList = "uv-severe list-group-item";
    };

    listGroup.appendChild(uvEl);

    cityEl.appendChild(listGroup);
};
        
        
var futureWeatherCard = function (data, city, state) {
    // loop through array of future dates to get data
    for (var i = 1; i < 6; i++) {
        console.log(data.daily[i].dt);
    // create future city card
    var futureCard = document.createElement("div");
    futureCard.classList = "card col-5 col-md-3 col-lg-2 shadow border border-dark card-group";
    
    // get image icon from data and append to card
    var imgEl = document.createElement("img");
    var icon = data.daily[i].weather[0].icon;
    imgEl.classList = "card-img-top";
    imgEl.src = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

    futureCard.appendChild(imgEl);

    var cardBodyEl = document.createElement("div");
    cardBodyEl.classList = "card-body";

    futureCard.appendChild(cardBodyEl);

    var cardTitleEl = document.createElement("h5");
    cardTitleEl.classList = "card-title";
    cardTitleEl.textContent = city + ", " + state;

    var dateEl = document.createElement("p");
    dateEl.classList = "card-text";
    var unix = data.daily[i].dt;
    var momentDate = moment.unix(unix).format("dddd, MMMM Do, LT");
    dateEl.textContent = momentDate;

    cardBodyEl.appendChild(cardTitleEl);
    cardBodyEl.appendChild(dateEl);

    futureCardList(data, futureCard, i);

   
    // append the card to the main body
    cityContainerEl.appendChild(futureCard);
    };
};


var futureCardList = function(data, futureCard, i) {
    var listGroup = document.createElement("ul");
    listGroup.classList = "list-group list-group-flush";

    var tempEL = document.createElement("li");
    tempEL.classList = "list-group-item";
    tempEL.innerText = "High: " + data.daily[i].temp.max + "°F | Low: " + data.daily[i].temp.min;
    listGroup.appendChild(tempEL);

    var humidityEl = document.createElement("li");
    humidityEl.classList = "list-group-item";
    humidityEl.innerText = "Humidity: " + data.daily[i].humidity + "%";
    listGroup.appendChild(humidityEl);

    var windEl = document.createElement("li");
    windEl.classList = "list-group-item";
    windEl.innerText = "Wind Speed: " + data.daily[i].wind_speed + "mph";
    listGroup.appendChild(windEl);

    var uvEl = document.createElement("li");
    var UV = data.daily[i].uvi
    uvEl.innerText = "UV Index: " + UV;
    // change UV Index color due to intensity
    if (UV <= 4) {
        uvEl.classList = "uv-light list-group-item";
    } else if (UV > 4 && UV < 8) {
        uvEl.classList = "uv-moderate list-group-item";
    } else {
        uvEl.classList = "uv-severe list-group-item";
    };

    listGroup.appendChild(uvEl);

    futureCard.appendChild(listGroup);
};


// function the takes user inputed data and checks it with APIs
var formSubmitHandler = function(event) {
    event.preventDefault();
    // console.log(event.target)

    // get name of user inputed city
    var city = cityInputEl.value.trim();
    // console.log(city);

    if (city) {
        getCityCoordinates(city);
        cityInputEl.value = "";
        searchHistory(city);
    } else {
        alert("Please enter an existing city.");
    }
};


var historyCoordinates = function(event) {
    var city = event.target.innerText.trim();
    console.log(city);

    // grab cards
    var cards = document.getElementsByClassName('card');
    // console.log(cards);

    // remove old cards
    while(cards.length > 0) {
        console.log(cards);
        cards[0].remove();
    }

    getCityCoordinates(city);
};


searchFormEl.addEventListener("submit", formSubmitHandler);
// when search button is clicked, run the get coordinate function. need to clear screen first.
historyEl.addEventListener("click", historyCoordinates);