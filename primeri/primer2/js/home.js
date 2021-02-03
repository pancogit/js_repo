// homepage


// javascript for homepage
(function homepage() {

    var fetching = new FetchData('../js/data/data.json');

    // fetch data from server
    fetching.fetchDataFromServer()
        .then(updateArticles)
        .catch(errorHandle);

    // update articles on page
    function updateArticles(value) {
        var articles = new Articles(fetching.data);

        articles.updateNews();
        articles.updateTweets();
        articles.updateTips();
    }

    // error occurs
    function errorHandle(e) {
        console.error('Error is detected! ', e);
    }

}());