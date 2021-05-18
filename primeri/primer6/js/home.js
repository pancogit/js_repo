// homepage javascript

import Fetch from './fetch.js';
import Navigation from './navigation.js'

class Home {
    
    constructor() {
        this.fetch = new Fetch('../js/data/data.json');
        this.navigation = 0;
    }

    fetchData() {
        this.fetch.getDataFromServer().then(this.fetchWithSuccess.bind(this));
    }

    // if data is fetched from server successfuly, then continue
    fetchWithSuccess(value) {
        this.navigation = new Navigation(this.fetch.data);
        this.navigation.add();
    }
}

new Home().fetchData();