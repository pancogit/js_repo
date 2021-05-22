// homepage javascript

import Fetch from './fetch.js';
import Navigation from './navigation.js'
import Hamburger from './hamburger.js';
import Breadcrumbs from './breadcrumbs.js';

class Home {
    
    constructor() {
        this.fetch = new Fetch('../js/data/data.json');
        this.navigation = 0;
        this.hamburger = 0;
        this.breadcrumbs = new Breadcrumbs();
    }

    fetchData() {
        this.fetch.getDataFromServer().then(this.fetchWithSuccess.bind(this));
    }

    // if data is fetched from server successfuly, then continue
    fetchWithSuccess(value) {
        this.navigation = new Navigation(this.fetch.data, this.breadcrumbs);
        this.navigation.add();
        this.hamburger = new Hamburger(this.navigation.navigation);
        this.hamburger.addListeners();
        this.breadcrumbs.navigationObject = this.navigation;
    }
}

new Home().fetchData();