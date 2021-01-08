// get data from server for page 


// read data for page from server
(function server() {

    // create XML HTTP Request
    var xhr = new XMLHttpRequest();
    var pageData = '../js/data/data.json';
    
    // init HTTP request
    xhr.open('GET', pageData);
    
    // send HTTP request to the server
    xhr.send();

    // add event listeners for load/error
    xhr.addEventListener('load', dataLoaded);
    xhr.addEventListener('error', errorLoad);

    // data is loaded
    function dataLoaded(e) {
        console.log('Page data is loaded with success: ', e);

        // get response from server
        var responseText = e.target.response;
    }

    // data is not loaded
    function errorLoad(e) {
        console.error('Page data is not loaded from server: ', e);
    }

}());