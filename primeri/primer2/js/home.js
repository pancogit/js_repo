// homepage


// javascript for homepage
(function homepage() {

    var fetching = new FetchData('../js/data/data.json');

    // fetch data from server
    fetching.fetchDataFromServer()
        .then(updateArticles)
        .then(updateSlides)
        .catch(errorHandle);

    // update articles on page
    function updateArticles(value) {
        var articles = new Articles(fetching.data);

        articles.updateNews();
        articles.updateTweets();
        articles.updateTips();
    }

    // update slides on page
    function updateSlides(value) {
        var slides = new Slides(fetching.data.slides);
        
        slides.addEventListeners();
    }

    // error occurs
    function errorHandle(e) {
        console.error('Error is detected! ', e);
    }

}());