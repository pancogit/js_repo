// news


// update news on page
(function news() {

    var fetch = new FetchData('../../js/data/data.json');
    var news;

    // fetch data from server
    fetch.fetchDataFromServer()
        .then(addNews)
        .catch(errorHandle);

    // add news on page
    function addNews(value) {
        news = new ArticleBlock(fetch.data.news, 'news-id');
        news.addArticles();
    }

    // error occurs
    function errorHandle(e) {
        console.error('Error is detected! ', e);
    }

}());