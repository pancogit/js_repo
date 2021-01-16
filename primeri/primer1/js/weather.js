// weather for locations


function weather() {

    // get DOM elements
    var weather = document.getElementById('weather-id');
    var buttons = weather.getElementsByClassName('weather__button');
    var buttonC = buttons[0];
    var buttonF = buttons[1];
    var activeButtonClass = 'weather__button--active';

    // flags for active buttons
    var activeButtonC = buttonC.classList.contains(activeButtonClass);
    var activeButtonF = buttonC.classList.contains(activeButtonClass);

    buttonC.addEventListener('click', updateActiveButton);
    buttonF.addEventListener('click', updateActiveButton);

    // update active button
    function updateActiveButton(e) {
        e.preventDefault();

        var target = e.target;

        // if the same button is not clicked again
        if (!target.classList.contains(activeButtonClass)) {
            target.classList.add(activeButtonClass);

            // remove active class from another button
            // update active button flag and reset inactive button flag
            // also update weather degree
            if (target === buttonC) {
                buttonF.classList.remove(activeButtonClass);
                activeButtonC = true;
                activeButtonF = false;
            }
            else if (target === buttonF) {
                buttonC.classList.remove(activeButtonClass);
                activeButtonF = true;
                activeButtonC = false;
            }

            // update degrees on page
            updateDegrees();
        }
    }

    // update degrees on page when button is activated
    function updateDegrees() {
        // get selected option text from select list
        var optionText = select.selectedOptions[0].textContent;

        // read data from server for selected option
        var serverData = findWeatherDataServer(optionText);

        // get DOM elements
        var data = weatherInfo.getElementsByClassName('weather__data')[0];
        var degree, cf;

        if (data) {
            degree = data.getElementsByClassName('weather__degree')[0];
            cf = data.getElementsByClassName('weather__cf')[0];
        }

        // if server data and DOM data exists
        if (serverData && data) {
            // find interval for current hour
            var interval = getIntervalRange(new Date().getHours());
            var serverObject = serverData.interval[interval];

            // update degrees on page
            if (activeButtonC) {
                degree.textContent = serverObject.degree.celsius;
                cf.innerHTML = '&deg;C';  // set as HTML because of HTML entity &deg;
            }
            else if (activeButtonF) {
                degree.textContent = serverObject.degree.fahrenheit;
                cf.innerHTML = '&deg;F';
            }
        }
    }

    var select = document.getElementById('weather__select-id');

    // fire event when select is changed
    select.addEventListener('change', selectChanged);

    // find weather info from DOM
    var weatherInfo = weather.getElementsByClassName('weather__info')[0];
    var weatherPlace = weather.getElementsByClassName('weather__place')[0];

    // select list is changed
    function selectChanged(e) {
        var select = e.target;
        var option = select.selectedOptions[0];
        var optionText = option.textContent;

        // read data from server for selected option
        var optionServer = findWeatherDataServer(optionText);

        // if data from server is found
        if (optionServer) {
            // remove location and message if they exists
            let location = weatherInfo.getElementsByClassName('weather__location')[0];
            let message = weatherInfo.getElementsByClassName('weather__message')[0];

            if (location) location.remove();
            if (message) message.remove();

            // append weather data HTML if it's not already on page
            let data = weatherInfo.getElementsByClassName('weather__data')[0];

            if (!data) {
                weatherInfo.append(weatherDataTemplate);
                data = weatherDataTemplate;
            }

            // fill weather data on page with data from server
            fillWeatherData(optionServer, data);
        }
    }

    // find server weather data
    function findWeatherDataServer(text) {
        var option;

        // loop through server response object
        for (let i = 0; i < responseObject.weathers.length; i++) {
            if (responseObject.weathers[i].location === text) {
                option = responseObject.weathers[i];
                break;
            }
        }

        return option;
    }

    // fill weather data on page with data from server
    function fillWeatherData(option, dataPage) {
        // select DOM elements to fill
        var image = dataPage.getElementsByClassName('weather__image')[0];
        var degree = dataPage.getElementsByClassName('weather__degree')[0];
        var cf = dataPage.getElementsByClassName('weather__cf')[0];
        var paragraph1 = dataPage.getElementsByClassName('weather__paragraph')[0];
        var paragraph2 = dataPage.getElementsByClassName('weather__paragraph')[1];
        var paragraph3 = dataPage.getElementsByClassName('weather__paragraph')[2];
        var number1 = paragraph1.getElementsByClassName('weather__number')[0];
        var number2 = paragraph2.getElementsByClassName('weather__number')[0];
        var number3 = paragraph3.getElementsByClassName('weather__number')[0];

        // get current time for hours to use good interval range for given location
        var date = new Date();
        var hours = date.getHours();

        // use good interval range for current hour and get interval object
        var currInterval = getIntervalRange(hours);
        var intervalObject = option.interval[currInterval];

        // fill weather data with server data for good interval range
        image.src = intervalObject.image;
        image.alt = intervalObject.image_info;

        if (activeButtonC) {
            degree.textContent = intervalObject.degree.celsius;
            cf.innerHTML = '&deg;C';  // set as HTML because of HTML entity &deg;
        }
        else if (activeButtonF) {
            degree.textContent = intervalObject.degree.fahrenheit;
            cf.innerHTML = '&deg;F';
        }

        number1.textContent = intervalObject.precipitation;
        number2.textContent = intervalObject.humidity;
        number3.textContent = intervalObject.wind;

        // update weather place at the bottom
        weatherPlace.textContent = option.location;
    }

    // get interval range for current hour
    function getIntervalRange(hour) {
        var interval;

        if (hour >= 0 && hour <= 3) interval = 0;
        else if (hour >= 4 && hour <= 7) interval = 4;
        else if (hour >= 8 && hour <= 11) interval = 8;
        else if (hour >= 12 && hour <= 15) interval = 12;
        else if (hour >= 16 && hour <= 19) interval = 16;
        else if (hour >= 20 && hour <= 23) interval = 20;

        return interval;
    }

    // HTML template for weather data
    var weatherDataTemplate = createWeatherData();

    // function for creating weather data html
    function createWeatherData() {
        // create elements
        var data = document.createElement('div');
        var picture = document.createElement('div');
        var cfDegree = document.createElement('div');
        var image = document.createElement('img');
        var degree = document.createElement('span');
        var cf = document.createElement('span');

        var imageSize = 50;

        // add attributes to elements
        data.classList.add('weather__data');
        picture.classList.add('weather__picture');
        cfDegree.classList.add('weather__cf-degree');
        image.classList.add('weather__image');
        image.width = imageSize;
        image.height = imageSize;
        degree.classList.add('weather__degree');
        cf.classList.add('weather__cf');

        data.append(picture);
        picture.append(cfDegree);
        cfDegree.append(image);
        cfDegree.append(degree);
        cfDegree.append(cf);

        var numbers = document.createElement('div');
        var paragraph1 = document.createElement('p');
        var paragraph2 = document.createElement('p');
        var paragraph3 = document.createElement('p');
        var number1 = document.createElement('span');
        var number2 = document.createElement('span');
        var number3 = document.createElement('span');

        numbers.classList.add('weather__numbers');
        paragraph1.classList.add('weather__paragraph');
        paragraph2.classList.add('weather__paragraph');
        paragraph3.classList.add('weather__paragraph');
        number1.classList.add('weather__number');
        number2.classList.add('weather__number');
        number3.classList.add('weather__number');

        numbers.append(paragraph1);
        numbers.append(paragraph2);
        numbers.append(paragraph3);
        paragraph1.append(document.createTextNode('Precipitation: '));
        paragraph1.append(number1);
        paragraph2.append(document.createTextNode('Humidity: '));
        paragraph2.append(number2);
        paragraph3.append(document.createTextNode('Wind: '));
        paragraph3.append(number3);

        data.append(numbers);

        // return template html
        return data;
    }

}