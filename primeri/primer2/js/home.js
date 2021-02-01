// homepage


// javascript for homepage
(function homepage() {

    
    var fetching = new FetchData();
    var articles = new Articles();

    // fetch data from server
    fetching.fetchDataFromServer()
        .then(updateArticles)
        .catch(errorHandle);

    // update articles on page
    function updateArticles(value) {
        articles.updateNews();
        articles.updateTweets();
        articles.updateTips();
    }

    // error occurs
    function errorHandle(e) {

    }

}());