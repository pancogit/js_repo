// homepage

// import classes from javascript modules
import { FetchData } from './fetch-data.js';
import { LoadData } from './load-data.js';


// javascript for homepage
(function home() {

    var fetch = new FetchData();

    fetch.fetchDataFromServer().then(loadData);

    function loadData(value) {
        var loading = new LoadData(fetch.data);
        loading.loadDataOnPage();
    }

}());