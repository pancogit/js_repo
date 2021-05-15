// homepage javascript

import Fetch from './fetch.js';

class Home {
    constructor() {
        this.fetch = new Fetch('../js/data/data.json');
    }

    fetchData() {
        this.fetch.getDataFromServer().then(this.fetchWithSuccess.bind(this));
    }

    // if data is fetched from server successfuly, then continue
    fetchWithSuccess(value) {

    }
}

new Home().fetchData();