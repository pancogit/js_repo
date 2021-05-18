// fetch data from server


export default class Fetch {
    
    constructor(path) {
        this.path = path;
        this.data = 0;
    }

    // fetch data from server and return promise
    getDataFromServer() {
        return $.ajax({
            url: this.path,
            method: 'GET'
        })
        .done(this.successfulFetch.bind(this))
        .fail(this.failedFetch.bind(this));
    }

    successfulFetch(data, textStatus, jqXHR) {
        this.data = data;
    }

    failedFetch(data, textStatus, errorThrown) {
        console.error('Data is not fetched from server!');
    }
}