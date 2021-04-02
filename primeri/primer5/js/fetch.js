// fetch data from server


export class Fetch {

    constructor() {
        this.data = 0;
        this.path = '../js/data/data.json';
        this.errorMessage = 'Data is not fetched from server!';
    }

    // fetch data and return resolved promise with server data or 
    // rejected promise with error message
    getDataFromServer() {
        return fetch(this.path).then(this.fetchFinished.bind(this));
    }

    fetchFinished(response) {
        if (response.ok) return this.fetchSuccessfull(response);
        else             return this.fetchFailed();
    }

    fetchSuccessfull(response) {
        // get json data via new promise call
        return response.json().then(this.getJSONData.bind(this));
    }
    
    getJSONData(JSONobject) {
        this.data = JSONobject;

        return Promise.resolve(this.data);
    }

    fetchFailed() {
        return Promise.reject(new Error(this.errorMessage));
    }
}