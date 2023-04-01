const date = new Date(); // Creating a new date object to get the current date
const day = date.getDate();  // Getting the current day
const num_month = date.getMonth() + 1; // Getting the current month as janurary is 0 in the date object
const year = date.getFullYear(); // Getting the current year
const month = {
    1: "January", 2: "February",
    3: "March", 4: "April", 5: "May", 6: "June",
    7: "July", 8: "August", 9: "September",
    10: "October", 11: "November",
    12: "December"
}[num_month]; // Getting the month name from the month object
const fullDate = `${month} ${day} ${year}`; // Creating a string with the current date
console.log(fullDate); // Printing the current date to the console
document.getElementById("date").innerHTML = fullDate; // Displaying the current date on the page

setInterval(function () {
    const date = new Date();
    const time = date.toLocaleTimeString();
    document.getElementById("time").innerHTML = time;
}, 1000); // Refreshing the time every second

var default_city = "West Lancashire"; // Default city to be displayed on page load
window.onload = function (default_city) { // Function to be executed on page load
    search(default_city); // Calling the search function with the default city as the parameter
}

var input = document.getElementById("search"); // Getting the search input element
input.addEventListener("keypress", function (event) {
    if (event.key == "Enter") { // Checking if the enter key is pressed
        search();
    }
});

function search(city) {
    var api_key = "0529ca1b324be03b982f8b057d590cd0"; 
    var city = document.getElementById("search").value; // Getting the value of the search input
    city = city || default_city; // If the search input is empty, the default city will be used
    document.getElementById("city").innerHTML = "&nbsp;" + city; // Displaying the city name on the page
    var geo_url = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=3&appid=' + api_key;
    //Creating the url for the geolocation api
    async function getapi(url) {
        try{
        const response = await fetch(url); // Fetching the data from the api
        var data = await response.json(); // Converting the data to json
        geo_data(data); // Calling the geo_data function with the data as the parameter
        api(data); // Calling the api function with the data as the parameter
        }catch(error){
            document.getElementById("city").innerHTML = "&nbsp;" + "City not found";
            document.getElementById("country").innerHTML = "";
            document.getElementById("temperature").innerHTML = "N/A";
            document.getElementById("wind").innerHTML = "N/A";
            document.getElementById("humidity").innerHTML = "N/A";
            document.getElementById("climate").innerHTML = "";
            document.getElementById("description").innerHTML = "Try Again";
            document.getElementById("rainfall").innerHTML = "N/A";
            document.body.style.backgroundImage = "url(/img/default.jpg)";
            document.getElementById("weather-icon").innerHTML = "<img src='/icons/Weather/sad.png'>";
            console.log(error);
        }
    }
    getapi(geo_url); // Calling the getapi function with the geo_url as the parameter
}
function geo_data(data) {
    let lat = `${data[0].lat}`; // Getting the latitude from the data
    let lon = `${data[0].lon}`; // Getting the longitude from the data
    return [lat, lon]; // Returning the latitude and longitude as an array
}

function api(data) {
    var api_key = "0529ca1b324be03b982f8b057d590cd0"; // API key for the weather api
    var [lat, lon] = geo_data(data);
    var api_url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + api_key + '&units=metric';
    console.log(api_url);
    async function getapi(url) { // Creating the url for the weather api
        const response = await fetch(url); // Fetching the data from the api
        var data = await response.json(); // Converting the data to json
        show(data); // Calling the show function with the data as the parameter
    }
    getapi(api_url); // Calling the getapi function with the api_url as the parameter
}

function show(data) {
    let temp = `${data.main.temp}`; // Getting the temperature from the data
    document.getElementById("temperature").innerHTML = parseFloat(temp).toFixed(2) + " °C"; // Displaying the temperature on the page
    
    let wind = `${data.wind.speed} m/s`; // Getting the wind speed from the data
    document.getElementById("wind").innerHTML = wind; // Displaying the wind speed on the page

    let humidity = `${data.main.humidity} %`; // Getting the humidity from the data
    document.getElementById("humidity").innerHTML = humidity; // Displaying the humidity on the page 

    let climate = `${data.weather[0].main}`; // Getting the climate from the data
    document.getElementById("climate").innerHTML = climate + " in "; // Displaying the climate on the page

    let description = `${data.weather[0].description}`; // Getting the description from the data
    document.getElementById("description").innerHTML = "Some " + description; // Displaying the description on the page

    if (data.rain) {
        let rainfall = `${data.rain["1h"]}`;
        document.getElementById("rainfall").innerHTML = rainfall + " mm"; // Displaying the rainfall on the page
    } else {
        document.getElementById("rainfall").innerHTML = "N/A"; // Displaying the rainfall on the page
        document.getElementById("no-rain").innerHTML = "No Rainfall Detected";
    }




    var src = document.getElementById("weather-icon"); // Getting the weather icon element
    while (src.firstChild) { // Removing the previous weather icon
        src.removeChild(src.firstChild); // Removing the previous weather icon
    }

    var img = document.createElement("img"); // Creating a new image element
    img.src = "icons/Weather/" + climate + ".png"; // Creating the url for the weather icon
    img.alt = "Weather Icon"; // Setting the alt attribute for the image
    src.appendChild(img); // Adding the image to the weather icon element

    let icon = `${data.weather[0].icon}`;
    let background; // Creating a variable to store the background image
    if (icon != null) { // Checking if the climate is not null
        background = "url(img/" + icon + ".jpg)"; // Creating the url for the background image
        document.body.style.backgroundImage = background; // Setting the background image
    } else { // If the climate is null
        background = "url(img/default.jpg)"; // Creating the url for the default background image
        document.body.style.backgroundImage = background; // Setting the default background image
    }
    console.log(background); // Printing the background image url to the console

    let country = `${data.sys.country}`; // Getting the country from the data
    document.getElementById("country").innerHTML = ", " + country; // Displaying the country on the page
}