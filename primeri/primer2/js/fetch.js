// fetching data from server


// data from server
var dataFromServer;

class FetchData {
    constructor() {

    }

    // fetch data from server and return promise when fetching is finished
    fetchDataFromServer() {
        return fetch('../js/data/data.json')
            .then(this.fetchData)
            .then(this.getJSON)
            .catch(this.fetchFail);
    }

    fetchData(value) {
        if (!value.ok) {
            console.error('Fetching data from server with bad status! ', value);
            return;
        }
        else console.log('Fetching data from server succeed! ', value);

        return value.json();
    }

    getJSON(value) {
        dataFromServer = value;
    }

    fetchFail(reason) {
        console.error('Fetching data from server failed! ', reason);
    }
}


/* (function fetching() {

    // fetch data from server
    fetch('../js/data/data.json')
        .then(fetchData)
        .then(getJSON)
        .then(updateNews)
        .then(updateTweets)
        .then(updateTips)
        .catch(errorDetected);

    function fetchData(value) {
        if (!value.ok) {
            console.error('Fetching data from server with bad status! ', value);
            return;
        }
        else console.log('Fetching data from server succeed! ', value);

        return value.json();
    }

    function getJSON(value) {
        dataFromServer = value;
    }

    function errorDetected(reason) {
        console.error('Error detected! ', reason);
    }


    var currentNewsIndex = 1;
    var newsClass = 'article-news-id';
    var news = document.getElementById(newsClass);

    // add news to the page
    function updateNews(value) {
        var serverData = dataFromServer.news;

        // add first news
        addArticle(news, currentNewsIndex - 1, serverData);

        // get buttons and add event listeners
        updateArticleButtons(news, serverData);
    }

    var tweetsClass = 'article-tweets-id';
    var tweets = document.getElementById(tweetsClass);
    var currentTweetsIndex = 1;

    // add tweets to the page
    function updateTweets(value) {
        var serverData = dataFromServer.tweets;

        // add first tweet
        addArticle(tweets, currentTweetsIndex - 1, serverData);

        // get buttons and add event listeners
        updateArticleButtons(tweets, serverData);
    }

    var tipsClass = 'article-tips-id';
    var tips = document.getElementById(tipsClass);
    var currentTipsIndex = 1;

    // add tips to the page
    function updateTips(value) {
        var serverData = dataFromServer.tips;

        // add first tip
        addArticle(tips, currentTipsIndex - 1, serverData);

        // get buttons and add event listeners
        updateArticleButtons(tips, serverData);
    }

    // add article with given index
    function addArticle(article, index, dataServer) {

        // get elements from dom
        var heading = article.getElementsByClassName('article__subheading')[0];
        var text = article.getElementsByClassName('article__text')[0];

        // update article on page
        var articleServer = dataServer[index];
        heading.textContent = articleServer.heading;

        var characters;

        // get first 200 characters
        if (article === news) {
            characters = articleServer.text[0].substr(0, 200);
            text.textContent = characters + '... ';
        }
        else {
            characters = articleServer.text.substr(0, 200);
            text.innerHTML = articleServer.date + '<br>' + characters + '... ';
        }

        var readMore = createReadMore(articleServer.link.home);

        // add read more to the page
        text.append(readMore);
    }

    var activeButtonClass = 'article__button--active';

    // update buttons on page for given article
    function updateArticleButtons(article, dataServer) {
        var buttons = article.getElementsByClassName('article__button');
        var buttonLeft = buttons[0];
        var buttonRight = buttons[1];
        var numberOfArticles = dataServer.length;

        // update active buttons
        if (numberOfArticles) {
            buttonLeft.classList.remove(activeButtonClass);
            buttonRight.classList.add(activeButtonClass);
        }

        buttonLeft.addEventListener('click', articleButtonClicked);
        buttonRight.addEventListener('click', articleButtonClicked);
    }

    // when article button is clicked
    function articleButtonClicked(e) {
        e.preventDefault();

        var target = e.target;

        // if arrow is clicked, target is parent element
        if (target.classList.contains('article__navigation')) target = target.parentElement;

        // exit from function if button is not active
        if (!target.classList.contains(activeButtonClass)) return;

        // get article element id
        var article = target.parentElement.parentElement.parentElement;
        var articleID = article.id;

        // left or right button clicked
        var leftOfRight = target.nextElementSibling;

        // get article information
        var articleInfo = getArticleInfo(articleID, leftOfRight);

        // add next article to the page
        addArticle(articleInfo.articleToAdd, articleInfo.index - 1, articleInfo.serverData);

        // update active button
        updateActiveButton(target, leftOfRight, articleInfo);
    }

    // update active button
    function updateActiveButton(element, leftOfRightButton, info) {

        // left button clicked
        if (leftOfRightButton) {
            // first article reached, disable button and exit from function
            if (info.index === 1) {
                element.classList.remove(activeButtonClass);
                return;
            }

            let rightButton = leftOfRightButton;

            // update active right button
            if (info.index <= info.numberOfArticles - 1)
                rightButton.classList.add(activeButtonClass);
        }

        // right button clicked
        else {
            // last article reached, disable button and exit from function
            if (info.index === info.numberOfArticles) {
                element.classList.remove(activeButtonClass);
                return;
            }

            let leftButton = element.previousElementSibling;

            // update active left button
            if (info.index > 1) leftButton.classList.add(activeButtonClass);
        }
    }

    // get article information
    function getArticleInfo(ID, leftOfRightButton) {
        var info = {};

        // update article information
        switch (ID) {
            case newsClass:
                if (leftOfRightButton) currentNewsIndex--;  // left button clicked
                else currentNewsIndex++;  // right button clicked

                info.index = currentNewsIndex;
                info.articleToAdd = news;
                info.serverData = dataFromServer.news;
                break;

            case tweetsClass:
                if (leftOfRightButton) currentTweetsIndex--;
                else currentTweetsIndex++;

                info.index = currentTweetsIndex;
                info.articleToAdd = tweets;
                info.serverData = dataFromServer.tweets;
                break;

            case tipsClass:
                if (leftOfRightButton) currentTipsIndex--;
                else currentTipsIndex++;

                info.index = currentTipsIndex;
                info.articleToAdd = tips;
                info.serverData = dataFromServer.tips;
                break;
        }

        info.numberOfArticles = info.serverData.length;

        return info;
    }

    // create read more link
    function createReadMore(path) {
        var link = document.createElement('a');

        link.href = path;
        link.textContent = 'Read More';
        link.classList.add('article__read-more');

        return link;
    }

}()); */