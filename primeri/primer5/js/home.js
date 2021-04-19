// homepage javascript

import { Fetch } from './fetch.js';
import { Header } from './header.js';
import { Battery } from './battery.js';
import { Navigation } from './navigation.js';

class Home {

    constructor() {
        this.fetch = new Fetch();
        this.header = 0;
        this.battery = 0;
        this.navigation = 0;
    }

    getServerData() {
        this.fetch.getDataFromServer().then(this.successfullFetch.bind(this))
                                      .catch(this.catchErrors.bind(this));
    }

    successfullFetch(value) {
        this.header = new Header(value);
        this.battery = new Battery();
        this.navigation = new Navigation();

        this.header.init();
        this.battery.add();
        this.navigation.addEventListeners();
    }

    catchErrors(reason) {
        console.error(reason);
    }
}

var home = new Home();

home.getServerData();