// homepage

// import classes from javascript modules
import { FetchData } from './fetch-data.js';
import { LoadData } from './load-data.js';
import { News } from './news.js';

// javascript for homepage
var fetch = new FetchData();

// after data is fetched from server, load all data on page
fetch.fetchDataFromServer().then(loadData);

function loadData(value) {
    var data = fetch.data;

    var loading = new LoadData(data);
    loading.loadDataOnPage();

    var news = new News(data);
    news.loadNews();
}