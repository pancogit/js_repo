// fetch data from server


export class Fetch {

    constructor() {
        this.data = null;
        this.dataFetched = false;
    }

    // get data from server and return promise as result
    getDataFromServer() {
        return fetch('../js/data/data.json')
                 .then(this.fetchFinished.bind(this)); // send this pointer to handler function
    }

    fetchFinished(value) {
        if (value.ok) {
            console.log('Data is fetched from server with succeess. ', value);
            this.dataFetched = true;

            // convert server response to JSON object via js promise and return promise
            return value.json().then(this.getJSONData.bind(this));
        }
        else {
            let errorMessage = 'Data is not fetched from server! ';
            console.error(errorMessage, value);

            // return rejected promise
            return Promise.reject(errorMessage)
        }
    }

    getJSONData(jsonData) {
        this.data = jsonData;
    }
}