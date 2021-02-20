// fetch data from server


export class FetchData {

    constructor() {
        this.path = '../js/data/data.json';
        this.data = 0;
    }

    // fetch data via api and return promise
    fetchDataFromServer() {
        return fetch(this.path)
                 .then(this.getData)
                 .then(this.getJSONObject.bind(this))  // send this pointer to function
                 .catch(this.handleError);
    }

    getData(value) {
        if (value.ok) console.log('Data is fetched from server with success. ', value);
        else throw new Error('Data is not fetched from server! ');

        // get JSON objects via new promise
        return value.json();
    }

    getJSONObject(value) {
        this.data = value;
    }

    handleError(reason) {
        console.error(reason.message);
    }
}