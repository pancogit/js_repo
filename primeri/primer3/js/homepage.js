// homepage

// import classes from javascript modules
import { FetchData } from './fetch-data.js';
import { LoadData } from './load-data.js';
import { News } from './news.js';
import { Laywer } from './lawyer.js';

// javascript for homepage
var fetch = new FetchData();

// after data is fetched from server, load all data on page 
// and add event listeners
fetch.fetchDataFromServer().then(loadData);

function loadData(value) {
    var data = fetch.data;
    var news = new News(data.latest_news);
    var lawyer = new Laywer(data.lawyers);
    var loading = new LoadData(data, news, lawyer);

    loading.loadDataOnPage();
    news.loadNews();
    lawyer.updateLawyerInfo();
}