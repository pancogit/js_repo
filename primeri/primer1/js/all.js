// all javascript files merged 


// get data from server for page 

// save JSON data from server in global variable
var responseObject;

// unique ID for each comment
// for each new comment, comment ID is incremented
var commentID = 1;

// read data for page from server
// if javascript is not enabled, then static data will stay on page
// otherwise, static data is deleted and server data is loaded on page
(function server() {

    // create XML HTTP Request
    var xhr = new XMLHttpRequest();
    var pageData = '../js/data/data.json';

    // init HTTP request
    xhr.open('GET', pageData);

    // send HTTP request to the server
    xhr.send();

    // add event listeners for load/error
    xhr.addEventListener('load', dataLoaded);
    xhr.addEventListener('error', errorLoad);

    var responseText;

    // data is loaded
    function dataLoaded(e) {
        console.log('Page data is loaded with success: ', e);

        // get response from server and convert them to JSON object
        responseText = e.target.response;
        responseObject = JSON.parse(responseText);

        // load data on page
        loadLogin();
        loadCards();
        loadWeathers();
        loadArticles();
        loadComments();

        // after data is loaded on page, call functions for all javascript components on page
        // if functions for javascript components are called before server data is loaded on page,
        // then server data on page will overwrite DOM components and their javascript behavior (event listeners, etc.)
        // after data is loaded on page, javascript components are then able to work properly
        time();
        login();
        dropdown();
        navigation();
        subscribe();
        weather();
        comments();
    }

    // data is not loaded
    function errorLoad(e) {
        console.error('Page data is not loaded from server: ', e);
    }

    // load login information
    function loadLogin() {
        // get elements from DOM
        var loginName = document.getElementById('login__name-id');
        var loginNameLink = loginName.parentElement;
        var loginImage = document.getElementById('login__image-id');
        var loginImageLink = loginImage.parentElement;

        // load data from server for login user
        loginName.textContent = responseObject.login.name;
        loginNameLink.href = responseObject.login.link;
        loginImage.src = responseObject.login.picture;
        loginImage.alt = responseObject.login.picture_info;
        loginImageLink.href = responseObject.login.link;
    }

    // load cards information
    function loadCards() {
        var imageSize = 55;

        // remove static data from page
        var cards = document.getElementById('home__cards-id');
        var numberOfCards = cards.children.length;

        for (let i = 0; i < numberOfCards; i++) cards.children[0].remove();

        // load data for cards from server
        responseObject.cards.forEach(function iterate(element) {
            // create card template
            let card = document.createElement('a');
            let image = document.createElement('img');
            let info = document.createElement('p');

            card.append(image);
            card.append(info);

            // add classes and attributes
            card.classList.add('card');
            image.alt = element.picture_info;
            image.width = imageSize;
            image.height = imageSize;
            image.classList.add('card__image');
            info.classList.add('card__info');

            // load data
            info.textContent = element.info;
            card.href = element.link;
            image.src = element.picture;

            // insert card into DOM
            cards.append(card);
        });
    }

    // load weathers information
    function loadWeathers() {
        // get element from DOM
        var weatherSelect = document.getElementById('weather__select-id');

        // remove static data
        var numberOfOptions = weatherSelect.length;

        // remove all options except first
        // don't remove first option (choose a location)
        for (let i = 1; i < numberOfOptions; i++) weatherSelect.children[1].remove();

        var locationString;

        // create option and load data
        responseObject.weathers.forEach(function iterate(element) {
            let option = document.createElement('option');
            option.classList.add('weather__option');
            option.textContent = element.location;

            // parse element location for option value
            // replace one or more whitespaces with dash (-) and remove commas using regular expression
            // use global flag (g) for searching for all paterns
            // after that, convert string to lower case
            locationString = element.location.replace(/\s+/g, '-');
            locationString = locationString.replace(/,/g, '');
            locationString = locationString.toLowerCase();

            // set option value with weather- prefix
            option.value = 'weather-' + locationString;

            // add to DOM
            weatherSelect.append(option);
        });
    }

    // load articles information
    function loadArticles() {
        // get articles wrapper from DOM
        var articlesWrapper = document.getElementById('badge__wrapper--articles-id');
        var numberOfArticles = articlesWrapper.children.length;

        // remove static articles first
        for (let i = 0; i < numberOfArticles; i++) articlesWrapper.children[0].remove();

        var imageSize = 60;

        // add articles from server
        responseObject.articles.forEach(function iterate(element, index) {
            // create article
            let article = document.createElement('div');
            let left = document.createElement('div');
            let linkImage = document.createElement('a');
            let image = document.createElement('img');
            let info = document.createElement('div');
            let linkHeading = document.createElement('a');
            let heading = document.createElement('h4');
            let date = document.createElement('p');
            let linkDemo = document.createElement('a');

            // add attributes and data
            article.classList.add('article');

            // add margin for all articles except last
            if (index !== responseObject.articles.length - 1) {
                article.classList.add('article--margin');
            }

            left.classList.add('article__left');
            linkImage.classList.add('article__link');
            linkImage.href = element.link;
            image.classList.add('article__image');
            image.src = element.picture;
            image.alt = element.picture_info;
            image.width = imageSize;
            image.height = imageSize;
            info.classList.add('article__info');
            linkHeading.classList.add('article__link');
            linkHeading.href = element.link;
            heading.classList.add('article__heading');
            heading.textContent = element.name;
            date.classList.add('article__date');
            date.textContent = element.date;
            linkDemo.classList.add('article__link', 'article__link--small');
            linkDemo.href = element.link;
            linkDemo.textContent = 'Demo Processes';

            // form html structure
            article.append(left);
            left.append(linkImage);
            linkImage.append(image);
            article.append(info);
            info.append(linkHeading);
            linkHeading.append(heading);
            info.append(date);
            info.append(linkDemo);

            // add article to page
            articlesWrapper.append(article);
        });
    }

    // load comments information
    function loadComments() {
        // get element from DOM
        var commentsWrapper = document.getElementById('badge__wrapper--comments-id');

        // remove static comments from page
        var commentList = commentsWrapper.getElementsByClassName('comment__box');
        var numberOfComments = commentList.length;

        for (let i = 0; i < numberOfComments; i++) commentList[0].remove();

        // add comments from server to the page
        responseObject.comments.forEach(function iterate(element) {

            // create and add comment to the page
            let commentBox = loadCommentsContent(element);
            commentsWrapper.append(commentBox);

            // add replies to comment recursively
            addReplies(element, commentsWrapper);
        });
    }


    // add replies to comment recursively
    function addReplies(element, commentsWrapper) {
        // add replies to comment
        element.reply.forEach(function replyIterate(element) {
            let commentBox = loadCommentsContent(element);
            commentBox.classList.add('comment__box--reply');  // add reply class
            commentsWrapper.append(commentBox);

            // call again the same function for nested reply and etc (depth first)
            addReplies(element, commentsWrapper);
        });
    }


    // load content from server for comment and return it
    function loadCommentsContent(element) {
        var imageSize = 70;

        // create comment elements
        var box = document.createElement('div');
        var left = document.createElement('div');
        var imageLink = document.createElement('a');
        var image = document.createElement('img');
        var info = document.createElement('div');
        var header = document.createElement('p');
        var userLink = document.createElement('a');
        var text = document.createElement('p');
        var footer = document.createElement('div');
        var replyLink = document.createElement('a');
        var dotReply = document.createElement('span');
        var likeLink = document.createElement('a');
        var dotLike = document.createElement('span');
        var personWrapper = document.createElement('div');
        var thumbLink = document.createElement('a');
        var thumb = document.createElement('i');
        var count = document.createElement('span');
        var liked = document.createElement('span');
        var dotLiked = document.createElement('span');
        var date = document.createElement('span');


        // add unique ID for each comment and save that ID in comments array
        box.id = 'comment-' + commentID++;
        element.id = box.id;

        // add attributes and data
        box.classList.add('comment__box');
        left.classList.add('comment__left');
        imageLink.classList.add('comment__link');
        imageLink.href = element.link;
        image.classList.add('comment__image');
        image.src = element.picture;
        image.alt = element.picture_info;
        image.width = imageSize;
        image.height = imageSize;
        info.classList.add('comment__info');
        header.classList.add('comment__header');
        userLink.classList.add('comment__link', 'comment__user');
        userLink.href = element.link;
        userLink.textContent = element.user;
        text.classList.add('comment__text');
        text.textContent = element.comment;
        footer.classList.add('comment__footer');
        replyLink.classList.add('comment__link', 'comment__link--small', 'comment__reply-link');
        replyLink.href = element.link;
        replyLink.textContent = 'Reply';
        dotReply.classList.add('comment__dot');
        dotReply.innerHTML = '&bull;';  // add HTML entity as HTML
        likeLink.classList.add('comment__link', 'comment__link--small', 'comment__like-link');
        likeLink.href = element.link;
        likeLink.textContent = 'Like';
        dotLike.classList.add('comment__dot');
        dotLike.innerHTML = '&bull;';  // add HTML entity as HTML
        personWrapper.classList.add('comment__person-wrapper');
        thumbLink.classList.add('comment__link', 'comment__link--small', 'comment__person-link');
        thumbLink.href = element.link;

        // if there are no likes for comment, then disable list for clicking
        if (element.likeList.numberOfLikes == 0) {
            thumbLink.classList.add('comment__person-link--empty-list');
        }

        thumb.classList.add('far', 'fa-thumbs-up', 'comment__like');
        count.classList.add('comment__count');
        count.textContent = element.likeList.numberOfLikes;
        liked.classList.add('comment__liked');
        liked.textContent = 'liked this';
        dotLiked.classList.add('comment__dot');
        dotLiked.innerHTML = '&bull;';  // add HTML entity as HTML
        date.classList.add('comment__date');
        date.textContent = element.date;

        // form html structure
        box.append(left);
        left.append(imageLink);
        imageLink.append(image);
        box.append(info);
        info.append(header);
        header.append(userLink);
        header.append(' wrote...');
        info.append(text);
        info.append(footer);
        footer.append(replyLink);

        // add text node with new line between every footer element
        footer.append(document.createTextNode('\n'));

        footer.append(dotReply);
        footer.append(document.createTextNode('\n'));
        footer.append(likeLink);
        footer.append(document.createTextNode('\n'));
        footer.append(dotLike);
        footer.append(document.createTextNode('\n'));
        footer.append(personWrapper);
        personWrapper.append(thumbLink);
        thumbLink.append(thumb);
        thumbLink.append(document.createTextNode('\n'));
        thumbLink.append(count);
        thumbLink.append(document.createTextNode('\n'));
        thumbLink.append(' person');
        footer.append(document.createTextNode('\n'));
        footer.append(liked);
        footer.append(document.createTextNode('\n'));
        footer.append(dotLiked);
        footer.append(document.createTextNode('\n'));
        footer.append(date);

        // return comment box
        return box;
    }

}());


// update time in header


function time() {

    // header time from DOM
    var time = document.getElementById('header__time-id');

    // update time periodically after 10 seconds (10000 miliseconds)
    var ms = 10000;

    // call asynchronous function peridically on intervals after time specified
    setInterval(updateTime, ms);

    // update time initially at the beginning
    updateTime();

    // update time periodically
    function updateTime() {
        // get current date
        var currDate = new Date();
        var hours = currDate.getHours();
        var mins = currDate.getMinutes();

        // prepend zero for one digit
        if (mins < 10) mins = '0' + mins;
        if (hours < 10) hours = '0' + hours;

        // update date in DOM
        time.textContent = hours + ':' + mins;
    }

}


// user login box


function login() {

    // get user info from DOM
    var userLink = document.getElementById('header__link--user-id');
    var userLogin = document.getElementById('login-id');
    var circle = document.getElementById('header__circle-id');
    var icon = document.getElementById('header__icon--user-id');
    var loginContent = document.getElementById('login__content-id');
    var loginEnd = document.getElementById('login__end-id');

    // add event listener when link is clicked
    userLink.addEventListener('click', openLogin);

    // open login box when link is clicked
    function openLogin(e) {
        // prevent link to redirect
        e.preventDefault();

        // show login box
        userLogin.classList.add('show');
    }

    // close login box when anywhere on window is clicked out of login box or login icon
    window.addEventListener('click', closeLogin);

    // close login box
    function closeLogin(e) {
        var target = e.target;

        // close login box only if login box is not clicked or login icon
        if (target !== userLogin    && target !== userLink &&
            target !== circle       && target !== icon     && 
            target !== loginContent && target !== loginEnd) {
            userLogin.classList.remove('show');
        }
    }

}


// dropdown menu


// when dropdown menu is clicked, show menu and change dropdown arrow
function dropdown() {

    // get all dropdowns from DOM
    var dropdownList = document.getElementsByClassName('dropdown');
    var listAll = document.getElementsByClassName('dropdown__list');

    // add event listener for every dropdown
    for (let i = 0; i < dropdownList.length; i++) {
        dropdownList[i].addEventListener('click', toggleDropdown);
    }

    // toggle dropdown menu
    function toggleDropdown(e) {
        var target = e.target;
        var dropdown;

        if (!target.classList.contains('dropdown__icon')) {
            dropdown = target.parentElement;
        } 
        else {
            dropdown = target.parentElement.parentElement;
        }

        var list = dropdown.getElementsByClassName('dropdown__list')[0];
        var icon = dropdown.getElementsByClassName('dropdown__icon')[0];

        // if it's not dropdown link
        if (!target.classList.contains('dropdown__link')) {
            e.preventDefault();

            // close other dropdowns
            for (let i = 0; i < listAll.length; i++) {
                if (listAll[i] !== list) listAll[i].classList.remove('show');
            }

            // toggle dropdown list
            list.classList.toggle('show');

            // toggle icon arrow
            if (icon.classList.contains('fa-angle-down')) {
                icon.classList.remove('fa-angle-down');
                icon.classList.add('fa-angle-up');
            }
            else if (icon.classList.contains('fa-angle-up')) {
                icon.classList.remove('fa-angle-up');
                icon.classList.add('fa-angle-down');
            }
        }
    }

    // close all dropdowns when out of dropdown is clicked anywhere on window
    window.addEventListener('click', closeDropdown);

    // close dropdown windows
    function closeDropdown(e) {
        var target = e.target;
        var icons = [];

        var targetIcon;

        // select icon from target
        if (!target.classList.contains('dropdown__icon')) {
            targetIcon = target.getElementsByClassName('dropdown__icon')[0];
        }
        else {
            targetIcon = target;
        }
        
        // get all dropdown icons from DOM
        for (let i = 0; i < dropdownList.length; i++) {
            icons[i] = dropdownList[i].getElementsByClassName('dropdown__icon')[0];
        }

        // set other dropdown icons to down
        for (let i = 0; i < icons.length; i++) {
            if (icons[i] !== targetIcon) {
                icons[i].classList.remove('fa-angle-up');
                icons[i].classList.add('fa-angle-down');
            }
        }

        // if it's not dropdown link, arrow or icon, close dropdowns
        if (!target.classList.contains('dropdown__link')  && 
            !target.classList.contains('dropdown__arrow') &&
            !target.classList.contains('dropdown__icon')) {

            for (let i = 0; i < listAll.length; i++) {
                listAll[i].classList.remove('show');
            }
        }
    }

}


// navigation menu for hamburger menu


function navigation() {

    var hamburgerLink = document.getElementById('hamburger__link-id');
    var navigation = document.getElementById('navigation-id');
    var close = document.getElementById('navigation__close-link-id');

    // show navigation when hamburger link is clicked
    hamburgerLink.addEventListener('click', showNavigation);

    function showNavigation(e) {
        e.preventDefault();

        // show navigation
        navigation.classList.add('show');
    }

    // hide navigation when close button is clicked
    close.addEventListener('click', hideNavigation);

    function hideNavigation(e) {
        e.preventDefault();

        // hide navigation
        navigation.classList.remove('show');
    }

    // close navigation when out of navigation is clicked
    window.addEventListener('click', closeNavigation);

    function closeNavigation(e) {
        var target = e.target;
         
        // close navigation if it's opended and if it's not any of navigation elements clicked
        if (navigation.classList.contains('show')           &&
            target !== navigation                           &&
            target !== hamburgerLink                        &&
            !target.classList.contains('hamburger__icon')   &&
            !target.classList.contains('navigation__close') &&
            !target.classList.contains('dropdown__arrow')   &&
            !target.classList.contains('navigation__link')  &&
            !target.classList.contains('dropdown__link')    &&
            !target.classList.contains('dropdown__icon')) {

            navigation.classList.remove('show');
        }
    }

}


// subscribe with email in the footer


function subscribe() {

    var email = document.getElementById('subscribe__email-id');
    var form = document.getElementById('subscribe-id');

    // create email messages
    var emailErrorMessage = document.createElement('p');
    var emailClass = 'subscribe__message';
    var errorClassModifier = 'subscribe__message--error';
    var emailGoodMessage = document.createElement('p');
    var emailGoodClassModifier = 'subscribe__message--good';

    // user info
    // find logged user name for message
    var username = document.getElementById('login__name-id').textContent;

    // error message for email
    emailErrorMessage.classList.add(emailClass, errorClassModifier);
    emailErrorMessage.textContent = 'Please enter valid email address';

    // good message for email
    emailGoodMessage.classList.add(emailClass, emailGoodClassModifier);
    emailGoodMessage.textContent = username + ', you subscribed successfully.'

    // disable html5 validation, because custom validation of form will be used
    form.noValidate = true;

    // when form is submitted fire event
    form.addEventListener('submit', submitForm);

    // check if email is correct, and if it is close form and show message
    function submitForm(e) {
        e.preventDefault();

        let emailText = email.value;

        // regular expression for matching email address
        // whitespaces at the beginning and at the end are allowed
        // first one or more letters followed by zero or more letters or numbers
        // after that dot . followed by one or more letters followed by zero or more 
        // letters or numbers may come once or not
        // then @ comes
        // one or more letters followed by zero or more letters or numbers is next
        // then dot . comes
        // finally, two to four small letters must come
        let regExpr = /^\s*[a-zA-Z]+\w*(\.[a-zA-Z]+\w*){0,1}@[a-zA-Z]+\w*\.[a-z]{2,4}\s*$/;

        // if email is not in good format, show error
        if (!emailText.match(regExpr)) {
            email.classList.add('subscribe__email--error');

            // insert error message on page if it's not already there
            if (!email.nextElementSibling.classList.contains(errorClassModifier)) {
                email.after(emailErrorMessage);
            }
        }
        else {
            // email is in good format, show info and remove subscribe box
            form.after(emailGoodMessage);
            form.remove();
        }
    }

}


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


// comments on page


function comments() {

    // comment input and controls from DOM
    var input = document.getElementById('comment__input-id');
    var controls = document.getElementById('comment__controls-id');

    input.addEventListener('focus', showControls);

    // show comment controls
    function showControls(e) {
        controls.classList.add('show');
    }

    var submit = document.getElementById('comment__submit-id');
    var cancel = document.getElementById('comment__cancel-id');
    var commentsContainer = document.getElementById('badge__wrapper--comments-id');

    cancel.addEventListener('click', hideControls);

    // hide comment controls
    function hideControls(e) {
        e.preventDefault();

        // clear content and remove errors if exist
        controls.classList.remove('show');
        input.value = '';

        // if cancel is clicked and controls are not at the top of comments (for reply post)
        // then move comment input and controls to the top of comments
        if (commentsContainer.firstElementChild !== input) {
            input.remove();
            controls.remove();
            commentsContainer.prepend(input);
            input.after(controls);
        }

        // remove error info from page
        if (input.classList.contains(inputErrorClass)) {
            input.classList.remove(inputErrorClass);
            inputErrorMessage.remove();
        }
    }

    submit.addEventListener('click', postComment);

    // error message
    var inputErrorClass = 'comment__input--error';
    var inputErrorMessage = document.createElement('p');

    inputErrorMessage.classList.add('comment__message', 'comment__message--error');
    inputErrorMessage.textContent = 'Empty comments cannot be posted!'

    // function for posting comment
    function postComment(e) {
        e.preventDefault();

        // get comment text
        var comment = input.value;

        // search for whitespaces or for empty string (zero whitespaces) 
        // with regular expression from the beginning to the end of the comment string
        var emptyComment = comment.match(/^\s*$/);

        // if comment is empty, show error
        if (emptyComment) {
            if (!input.classList.contains(inputErrorClass)) {
                input.classList.add(inputErrorClass);
                input.after(inputErrorMessage);
            }
        }
        // comment is not empty, remove error
        else {
            input.classList.remove(inputErrorClass);
            inputErrorMessage.remove();
            input.value = '';

            // post comment and hide controls from page
            let commentPost = createComment(comment);

            // insert comment into page (normal comment post or reply post)
            insertComment(commentPost);

            // add comment in comments array
            cacheComment(commentPost);
        }
    }

    // insert comment into DOM to the right place
    function insertComment(comment) {

        // if reply comment is posted, then it must be inserted as reply comment in DOM
        // insert comment bellow comment controls
        controls.after(comment);
        controls.classList.remove('show');

        // check if comment is reply or not
        // if comment input is not at the beginning, then it's reply comment post
        if (commentsContainer.firstElementChild !== input) {
            // add reply modifier class
            comment.classList.add('comment__box--reply');

            // move comment input and controls at the beginning because reply comment is posted
            input.remove();
            controls.remove();
            commentsContainer.prepend(input);
            input.after(controls);
        }
    }

    // add new comment in comments array
    function cacheComment(comment) {
        // create new comment object
        var newComment = {};

        var image = comment.getElementsByClassName('comment__image')[0];
        var link = comment.getElementsByClassName('comment__link')[0];
        var user = comment.getElementsByClassName('comment__user')[0];
        var commentPosted = comment.getElementsByClassName('comment__text')[0];
        var count = comment.getElementsByClassName('comment__count')[0];
        var date = comment.getElementsByClassName('comment__date')[0];

        // add fields in comment object
        newComment.picture = image.src;
        newComment.picture_info = image.alt;
        newComment.link = link.href;
        newComment.user = user.textContent;
        newComment.comment = commentPosted.textContent;
        newComment.likeList = {};
        newComment.likeList.numberOfLikes = count.textContent;
        newComment.likeList.persons = [];
        newComment.date = date.textContent;
        newComment.reply = [];

        // save comment ID to comment array
        newComment.id = comment.id;

        // add new comment in comments array
        // if it's not reply, then push them into comments array as normal post
        if (!comment.classList.contains('comment__box--reply')) {
            responseObject.comments.push(newComment);
        }
        // it's reply post, find post to which it's replied and insert them into their reply handle
        else {
            let lastPostID = lastRepliedPost.id;

            // find cached comment to which is replied with given ID and insert reply to them
            findCommentAndCacheReply(lastPostID, newComment);
        }
    }

    // find cached comment to which is replied with given ID and insert reply to them
    function findCommentAndCacheReply(id, replyComment) {

        var comments = responseObject.comments;

        for (let i = 0; i < comments.length; i++) {
            // if original post comment is found, then insert reply to them
            if (comments[i].id === id) {
                comments[i].reply.push(replyComment);
                break;
            }

            // try to search in reply array
            let replies = comments[i].reply;

            // search in depth using recursion
            searchDepth(replies, id, replyComment);
        }
    }

    // // search comments in depth using recursion 
    function searchDepth(replies, id, replyComment) {

        for (let j = 0; j < replies.length; j++) {
            // if original post comment is found, then insert reply to them
            if (replies[j].id === id) {
                replies[j].reply.push(replyComment);
                break;
            }

            let anotherReplies = replies[j].reply;

            // search more in depth
            searchDepth(anotherReplies, id, replyComment);
        }
    }


    // create comment structure
    function createComment(comment) {
        // get logged user info from server for creating comment
        var login = responseObject.login;

        var imageSize = 70;

        // create comments elements
        var box = document.createElement('div');
        var left = document.createElement('div');
        var imageLink = document.createElement('a');
        var image = document.createElement('img');
        var info = document.createElement('div');
        var header = document.createElement('p');
        var userLink = document.createElement('a');
        var text = document.createElement('p');
        var footer = document.createElement('p');
        var reply = document.createElement('a');
        var replyDot = document.createElement('span');
        var like = document.createElement('a');
        var likeDot = document.createElement('span');
        var personWrapper = document.createElement('div');
        var personLink = document.createElement('a');
        var thumb = document.createElement('i');
        var count = document.createElement('span');
        var liked = document.createElement('span');
        var likedDot = document.createElement('span');
        var date = document.createElement('span');

        // add attributes

        // add unique ID for each comment
        box.id = 'comment-' + commentID++;

        box.classList.add('comment__box');
        left.classList.add('comment__left');
        imageLink.classList.add('comment__link');
        imageLink.href = login.link;
        image.classList.add('comment__image')
        image.alt = login.picture_info;
        image.src = login.picture;
        image.width = imageSize;
        image.height = imageSize;
        info.classList.add('comment__info');
        header.classList.add('comment__header');
        userLink.classList.add('comment__link', 'comment__user');
        userLink.href = login.link;
        userLink.textContent = login.name;
        text.classList.add('comment__text');
        text.textContent = comment;   // add comment as text to prevent XSS attack
        footer.classList.add('comment__footer');
        reply.classList.add('comment__link', 'comment__link--small', 'comment__reply-link');
        reply.href = login.link;
        reply.textContent = 'Reply';
        replyDot.classList.add('comment__dot');
        replyDot.innerHTML = '&bull;';  // set as HTML because of HTML entity
        like.classList.add('comment__link', 'comment__link--small', 'comment__like-link');
        like.href = login.link;
        like.textContent = 'Like';
        likeDot.classList.add('comment__dot');
        likeDot.innerHTML = '&bull;';
        personWrapper.classList.add('comment__person-wrapper');
        personLink.classList.add('comment__link', 'comment__link--small', 'comment__person-link');

        // then disable person link for clicking because for new comment there are likes yet
        personLink.classList.add('comment__person-link--empty-list');

        personLink.href = login.link;
        thumb.classList.add('far', 'fa-thumbs-up', 'comment__like');
        count.classList.add('comment__count');
        count.textContent = '0';
        liked.classList.add('comment__liked');
        liked.textContent = ' liked this';
        likedDot.classList.add('comment__dot');
        likedDot.innerHTML = '&bull;';
        date.classList.add('comment__date');

        // get current date
        var currDate = new Date();
        var dateString = currDate.toLocaleDateString();
        var hours = currDate.getHours();
        var minutes = currDate.getMinutes();

        // if it's one digit, append with leading zero
        if (hours < 10) hours = '0' + hours;
        if (minutes < 10) minutes = '0' + minutes;

        // get date components by splitting tokens with /
        var dateStringTokens = dateString.split('/');
        var day = dateStringTokens[0];
        var month = dateStringTokens[1];
        var year = dateStringTokens[2];

        if (day < 10) day = '0' + day;
        if (month < 10) month = '0' + month;

        date.textContent = day + '-' + month + '-' + year + ' ' + hours + ':' + minutes;

        // form html
        box.append(left);
        left.append(imageLink);
        imageLink.append(image);
        box.append(info);
        info.append(header);
        header.append(userLink);
        header.append(document.createTextNode(' wrote...'));
        info.append(text);
        info.append(footer);
        footer.append(reply);
        footer.append(document.createTextNode('\n'));  // put text node between elements
        footer.append(replyDot);
        footer.append(document.createTextNode('\n'));
        footer.append(like);
        footer.append(document.createTextNode('\n'));
        footer.append(likeDot);
        footer.append(document.createTextNode('\n'));
        footer.append(personWrapper);
        personWrapper.append(personLink);
        personLink.append(thumb);
        personLink.append(document.createTextNode('\n'));
        personLink.append(count);
        personLink.append(document.createTextNode(' person '));
        footer.append(liked);
        footer.append(document.createTextNode('\n'));
        footer.append(likedDot);
        footer.append(document.createTextNode('\n'));
        footer.append(date);

        // add event listeners for new created comments for reply, like and person link
        reply.addEventListener('click', replyComment);
        like.addEventListener('click', likeComment);
        personLink.addEventListener('click', listPersons);

        return box;
    }


    // reply, like and person links
    var replies = document.getElementsByClassName('comment__reply-link');
    var likes = document.getElementsByClassName('comment__like-link');
    var persons = document.getElementsByClassName('comment__person-link');

    // add event listeners
    for (let i = 0; i < replies.length; i++) replies[i].addEventListener('click', replyComment);
    for (let i = 0; i < likes.length; i++) likes[i].addEventListener('click', likeComment);
    for (let i = 0; i < persons.length; i++) persons[i].addEventListener('click', listPersons);

    // last post to which is replied
    var lastRepliedPost;

    // reply on comment
    function replyComment(e) {
        e.preventDefault();

        var target = e.target;

        // update last replied post
        lastRepliedPost = target.parentElement.parentElement.parentElement;

        // check for errors if exits before moving the next content
        var errorMessage = input.nextElementSibling;

        // move comment input and controls bellow new comment
        // remove elements from DOM
        input.remove();
        controls.remove();

        // clear input with previous content
        input.value = '';

        // remove errors if exists from previous content
        if (errorMessage) {
            // if error is found, remove it from page
            if (errorMessage.classList.contains('comment__message')) {
                errorMessage.remove();
            }
        }

        // also remove error border if error occurs from previous content
        if (input.classList.contains('comment__input--error')) {
            input.classList.remove('comment__input--error');
        }

        // when reply is clicked, show controls
        if (!controls.classList.contains('show')) controls.classList.add('show');

        // insert elements in DOM bellow new comment
        var newComment = target.parentElement.parentElement.parentElement;
        newComment.after(input);
        input.after(controls);
    }

    // like comment
    function likeComment(e) {
        e.preventDefault();

        // get target, comment box, count for likes and like link from DOM
        var target = e.target;
        var comment = target.parentElement.parentElement.parentElement;
        var count = comment.getElementsByClassName('comment__count')[0];
        var likeLink = comment.getElementsByClassName('comment__like-link')[0];

        // ID for comment
        var id = comment.id;

        // find comment from cached comments
        var commentCache = findCommentById(id);
        var likeList = commentCache.likeList;
        var personList = likeList.persons;
        var personFound = false;

        // username for logged user
        var username = responseObject.login.name;
        var userLink = responseObject.login.link;

        // search in person list and if it is not already liked, like it
        for (let i = 0; i < personList.length; i++) {
            if (personList[i].name === username) {
                personFound = true;
                break;
            }
        }

        // if number of likes is zero, than person list is disabled
        // enable it, because number of likes is not zero anymore after first like
        var emptyClass = 'comment__person-link--empty-list';
        var persons = comment.getElementsByClassName(emptyClass)[0];

        // enable person list
        if (persons) persons.classList.remove(emptyClass);


        // person is not found in like list, increment number of likes, display on the page
        // and add logged user to the like list
        if (!personFound) {
            likeList.numberOfLikes++;

            // update number of likes on page also
            count.textContent = likeList.numberOfLikes;

            personList.push({
                name: username,
                link: userLink
            });

            // remove cursor pointer for link and change color of liked comment
            likeLink.classList.add('comment__like-link--already-liked');
        }
    }


    // find comment by ID from response object
    function findCommentById(id) {
        var comments = responseObject.comments;

        // search for comment with given ID
        return findCommentByIdRecursive(id, comments);
    }

    // search for comment with given ID for given array recursively
    function findCommentByIdRecursive(id, arrayObject) {

        for (let i = 0; i < arrayObject.length; i++) {
            if (arrayObject[i].id === id) {
                return arrayObject[i];
            }

            // search deeper in comment replies array
            let replies = arrayObject[i].reply;
            let comment = findCommentByIdRecursive(id, replies);

            // if comment is found in replies, return that comment
            if (comment) return comment;
        }
    }

    // show on page list of all persons who liked comment
    function listPersons(e) {
        e.preventDefault();

        var target = e.target;
        var personWrapper;
        var targetList;
        var comment;

        if (target.classList.contains('comment__person-link')) {
            comment = target.parentElement.parentElement.parentElement.parentElement;
            personWrapper = target.parentElement;
        }
        else {
            comment = target.parentElement.parentElement.parentElement.parentElement.parentElement;
            personWrapper = target.parentElement.parentElement;
        }

        // target person list
        targetList = personWrapper.getElementsByClassName('comment__person-list')[0];

        // if one page list is opened on page, then it must be removed before opening another
        // all page lists must be closed on page before opening new one
        var commentsContainer = document.getElementById('badge__wrapper--comments-id');
        let pageLists = commentsContainer.getElementsByClassName('comment__person-list');

        pageListsNumber = pageLists.length;

        // close all page lists from page
        if (pageListsNumber) {
            for (let i = 0; i < pageListsNumber; i++) pageLists[0].remove();
        }

        // find cached comment object
        var commentObject = findCommentById(comment.id);
        var personList;
        var personListClass = 'comment__person-list';

        // add person list to the page if it's not already there
        // if person list is already on page, them don't add anything (it will be removed 
        // from page with previous code)
        if (commentObject && !personWrapper.getElementsByClassName(personListClass)[0] && !targetList) {
            // read person list
            personList = commentObject.likeList.persons;

            // person list container
            let personListContainer = document.createElement('div');

            personListContainer.classList.add(personListClass);

            // create link for each person and add to container
            personList.forEach(function iterate(value, index, array) {
                let personName = document.createElement('a');

                personName.classList.add('comment__person-name');
                personName.textContent = value.name;
                personName.href = value.link;
                personListContainer.append(personName);
            });

            // add person list container to the page if they are any persons
            if (personList.length) personWrapper.append(personListContainer);
        }
    }

    // close person lists from page if it's clicked out of person list or person link
    window.addEventListener('click', closePersonList);

    // close person lists from page
    function closePersonList(e) {
        var target = e.target;
        var commentsContainer = document.getElementById('badge__wrapper--comments-id');

        if (!target.classList.contains('comment__person-link') &&
            !target.classList.contains('comment__person-list') &&
            !target.classList.contains('comment__like')        &&
            !target.classList.contains('comment__count')       &&
            !target.classList.contains('class="comment__person-name')) {

            let list = commentsContainer.getElementsByClassName('comment__person-list');
            listNum = list.length;

            // remove all person lists from page
            if (listNum) {
                for (let i = 0; i < listNum; i++) list[0].remove();
            }
        }
    }
}
