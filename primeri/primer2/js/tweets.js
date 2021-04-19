// tweets


// update tweets on page
(function tweets() {

    var fetch = new FetchData('../../js/data/data.json');
    var tweets;

    // fetch data from server
    fetch.fetchDataFromServer()
        .then(addTweets)
        .catch(errorHandle);

    // add tweets on page
    function addTweets(value) {
        tweets = new ArticleBlock(fetch.data.tweets, 'tweets-id', true);
        tweets.addArticles();
    }

    // error occurs
    function errorHandle(e) {
        console.error('Error is detected! ', e);
    }

}());