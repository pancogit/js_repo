// homepage


import { Fetch } from './fetch.js';

var fetch = new Fetch();

fetch.getDataFromServer()
        .then(dataFetched.bind(null, fetch))  // send fetch object via bind
        .catch(dataNotFetched);

function dataFetched(value) {

}

function dataNotFetched(reason) {

}