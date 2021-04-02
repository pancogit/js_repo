// header


export class Header {

    constructor(dataFromServer) {
        this.data = dataFromServer;
        this.user = 0;
        this.date = 0;
        this.time = 0;
        this.userClass = 'header__user';
        this.dateClass = 'header__date';
        this.timeClass = 'header__time';
        this.info = document.querySelector('.header__info');
        this.center = document.querySelector('.header__center');
    }

    // init header information
    init() {
        this.initUser();

        // set current time at the beginning
        this.setTime();

        // refresh time every 30 seconds
        // bind this pointer to async function
        setInterval(this.setTime.bind(this), 30 * 1000);
    }

    initUser() {
        this.removeUserStaticData();
        this.user = this.createUserHTML();
        this.date = this.createDateHTML();

        // add user data to the page
        this.info.append(this.user);
        this.info.append(this.date);
    }

    removeUserStaticData() {
        var user = this.info.querySelector('.' + this.userClass);
        var date = this.info.querySelector('.' + this.dateClass);

        this.info.removeChild(user);
        this.info.removeChild(date);
    }

    createUserHTML() {
        var user = document.createElement('div');

        user.classList.add(this.userClass);
        user.textContent = this.data.user.name;

        return user;
    }

    createDateHTML() {
        var date = document.createElement('div');
        var birthday = document.createElement('span');
        var age = document.createElement('span');

        date.classList.add(this.dateClass);
        birthday.classList.add('header__birthday');
        birthday.textContent = this.data.user.birthday;
        age.classList.add('header__age');
        age.textContent = this.getAge();

        date.append(birthday);
        date.append(age);

        return date;
    }

    // return age in format: Xyr Ymo
    getAge() {
        var ageServer = this.data.user.birthday;
        var monthDayYear = ageServer.split('/');
        var month = parseInt(monthDayYear[0]), 
            year = parseInt(monthDayYear[2]);
        var currentDateString = new Date().toLocaleDateString();
        var currentMonthDayYear = currentDateString.split('/');
        var currentMonth = parseInt(currentMonthDayYear[0]),
            currentYear = parseInt(currentMonthDayYear[2]);
        var monthDifference = currentMonth - month,
            yearDifference = currentYear - year;
        
        var zeroYear = (yearDifference < 0) || (!yearDifference && (monthDifference <= 0));

        // return 0 if current year is greater or if it's the same year, but month is greater
        if (zeroYear) return '0yr 0mo';

        // for non negative months, return number of months with years
        if (monthDifference >= 0) return yearDifference + 'yr ' + monthDifference + 'mo';

        // for negative months, decrement year and return remaining months of the year
        return (yearDifference - 1) + 'yr ' + (12 + monthDifference) + 'mo';
    }

    setTime() {
        this.removeCurrentTime();
        this.time = this.createTimeHTML();
        this.center.prepend(this.time);
    }

    // remove current time from DOM
    removeCurrentTime() {
        var staticTime = document.querySelector('.' + this.timeClass);

        this.center.removeChild(staticTime);
    }

    createTimeHTML() {
        var time = document.createElement('div');
        var hoursMins = document.createElement('span');
        var period = document.createElement('span');
        var currentTime = this.getCurrentTime();

        time.classList.add(this.timeClass);
        hoursMins.classList.add('header__hours-mins');
        hoursMins.textContent = currentTime.hours + ':' + currentTime.minutes;
        period.classList.add('header__period');
        period.textContent = currentTime.period;

        time.append(hoursMins);
        time.append(document.createTextNode('\n'));  // insert HTML new line between elements
        time.append(period);

        return time;
    }

    // returns current time, hours, minutes and period
    getCurrentTime() {
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var period;

        // set hours by 12 hours clock with period
        if (hours > 12) {
            period = 'PM';
            hours -= 12;
        }
        else period = 'AM';

        // prepend leading zero if number is one digit
        if (hours < 10) hours = '0' + hours;
        if (minutes < 10) minutes = '0' + minutes;

        return {
            hours: hours,
            minutes: minutes,
            period: period
        }
    }
}