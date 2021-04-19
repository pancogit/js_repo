// battery


export class Battery {

    constructor() {
        this.statusClass = 'battery__status';
        this.wrapperClass = 'battery__wrapper';
        this.levelClass = 'battery__level';
        this.lowLevelClass = 'battery__level--low';
        this.lowLevelMaximum = 20;
        this.battery = document.querySelector('.battery');
        this.status = this.createStatusHTML();
        this.wrapper = this.createWrapperHTML();
        this.level = this.wrapper.querySelector('.' + this.levelClass);
        this.currentStatus = 100;
        this.batteryID = 0;
    }

    // add battery to the page
    add() {
        this.removeStaticBattery();

        this.battery.append(this.status);
        this.battery.append(this.wrapper);

        // update battery status after some random time
        this.batteryID = setInterval(this.updateStatus.bind(this), Math.random() * 50000);
    }

    createStatusHTML() {
        var status = document.createElement('span');

        status.classList.add(this.statusClass);
        status.textContent = '100%';

        return status;
    }

    createWrapperHTML() {
        var wrapper = document.createElement('div');
        var content = document.createElement('div');
        var level = document.createElement('div');
        var cap = document.createElement('div');
        var triangle = document.createElement('div');
        var crop = document.createElement('div');

        wrapper.classList.add(this.wrapperClass);
        content.classList.add('battery__content');
        level.classList.add(this.levelClass);
        cap.classList.add('battery__cap');
        triangle.classList.add('battery__triangle');
        crop.classList.add('battery__crop');

        wrapper.append(content);
        wrapper.append(cap);
        content.append(level);
        cap.append(triangle);
        cap.append(crop);

        return wrapper;
    }

    removeStaticBattery() {
        var status = document.querySelector('.' + this.statusClass);
        var wrapper = document.querySelector('.' + this.wrapperClass);

        this.battery.removeChild(status);
        this.battery.removeChild(wrapper);
    }

    updateStatus() {
        // battery loss is random integer between 0 - 5
        var batteryLoss = Math.floor((Math.random() * 5));
        var newStatus = this.currentStatus - batteryLoss;
        var changeStatus = newStatus >= 0;

        // don't update status if it's bellow zero
        if (changeStatus && !this.emptyBattery) {
            this.currentStatus = newStatus;

            let currentStatusString = this.currentStatus + '%';

            this.status.textContent = currentStatusString;
            this.level.style.width = currentStatusString;

            let levelAlreadyLow = this.level.classList.contains(this.lowLevelClass);
            let lowLevel = this.currentStatus <= this.lowLevelMaximum;

            // update low level battery indicator only if it's not already low level
            if (!levelAlreadyLow && lowLevel) this.level.classList.add(this.lowLevelClass);

            // if battery is empty, don't update status anymore
            if (!this.currentStatus) clearInterval(this.batteryID);
        }
    }
}