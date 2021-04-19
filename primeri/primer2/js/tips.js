// tips


// update tips on page
(function tips() {

    var fetch = new FetchData('../../js/data/data.json');
    var tips;

    // fetch data from server
    fetch.fetchDataFromServer()
        .then(addTips)
        .catch(errorHandle);

    // add tips on page
    function addTips(value) {
        tips = new ArticleBlock(fetch.data.tips, 'tips-id', true);
        tips.addArticles();
    }

    // error occurs
    function errorHandle(e) {
        console.error('Error is detected! ', e);
    }

}());