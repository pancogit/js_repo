// fetching data from server


class FetchData {
    constructor(dataPath) {
        this.path = dataPath;
        this.data = {};
    }

    // fetch data from server and return promise when fetching is finished
    fetchDataFromServer() {
        return fetch(this.path)
            .then(this.fetchData)
            .then(this.getJSON.bind(this))  // bind this pointer to function getJSON
            .catch(this.fetchFail);
    }

    fetchData(value) {
        if (!value.ok) {
            console.error('Fetching data from server with bad status! ', value);
            return;
        }
        else console.log('Fetching data from server succeed! ', value);

        return value.json();
    }

    // init data from server
    getJSON(value) {
        this.data = value;
    }

    fetchFail(reason) {
        console.error('Fetching data from server failed! ', reason);
    }
}