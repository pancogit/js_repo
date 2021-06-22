// homepage javascript

import Fetch from './fetch.js';
import Navigation from './navigation.js'
import Hamburger from './hamburger.js';
import Breadcrumbs from './breadcrumbs.js';
import Header from './header.js';
import Search from './search.js';
import Properties from './properties.js';

class Home {
    
    constructor() {
        this.fetch = new Fetch('../js/data/data.json');
        this.navigation = 0;
        this.hamburger = 0;
        this.breadcrumbs = 0;
        this.header = 0;
        this.search = 0;
        this.properties = 0;
    }

    fetchData() {
        this.fetch.getDataFromServer().then(this.fetchWithSuccess.bind(this));
    }

    // if data is fetched from server successfuly, then continue
    fetchWithSuccess(value) {
        this.search = new Search(this.fetch.data);
        this.search.addListeners();

        this.breadcrumbs = new Breadcrumbs(this.fetch.data, this.search);

        this.navigation = new Navigation(this.fetch.data, this.breadcrumbs, this.search);
        this.navigation.add();

        this.hamburger = new Hamburger(this.navigation.navigation);
        this.hamburger.addListeners();

        this.header = new Header(this.navigation.files);
        this.header.addListeners();

        this.properties = new Properties(this.navigation, this.navigation.files);
        this.properties.addListeners();

        this.navigation.header = this.header;
        this.breadcrumbs.navigationObject = this.navigation;
        this.breadcrumbs.header = this.header;
        this.search.breadcrumbs = this.breadcrumbs;
        this.search.files = this.navigation.files;
        this.search.size = this.navigation.size;
        this.properties.size = this.navigation.size;
    }
}

new Home().fetchData();