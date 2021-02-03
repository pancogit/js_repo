// detailed content of articles


(function detailedArticles() {

    var fetch = new FetchData('../../js/data/data.json');
    var article;

    // fetch data from server
    fetch.fetchDataFromServer()
        .then(addArticleContent)
        .catch(errorHandle);

    // add detailed article content on page
    function addArticleContent(value) {
        article = new ArticlePage(fetch.data);
        article.updateArticle();
    }

    // error occurs
    function errorHandle(e) {
        console.error('Error is detected! ', e);
    }

}());