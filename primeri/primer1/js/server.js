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