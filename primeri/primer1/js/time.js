// update time in header


function time() {

    // header time from DOM
    var time = document.getElementById('header__time-id');

    // update time periodically after 10 seconds (10000 miliseconds)
    var ms = 10000;

    // call asynchronous function peridically on intervals after time specified
    setInterval(updateTime, ms);

    // update time initially at the beginning
    updateTime();

    // update time periodically
    function updateTime() {
        // get current date
        var currDate = new Date();
        var hours = currDate.getHours();
        var mins = currDate.getMinutes();

        // prepend zero for one digit
        if (mins < 10) mins = '0' + mins;
        if (hours < 10) hours = '0' + hours;

        // update date in DOM
        time.textContent = hours + ':' + mins;
    }

}