// height and weight page


import { Page } from './page.js';
import { BMI } from './bmi.js';

export class HeightWeight extends Page {

    constructor(pageObject, linkObject, iconObject) {
        super(pageObject, linkObject, iconObject);

        let questions = this.page.querySelectorAll('.home__question');
        let calculations = this.page.querySelectorAll('.calculation__content');
        this.measureSignClass = 'measure__sign';
        this.measureSignDisabledClass = 'measure__sign--disabled';
        this.clickEvent = 'click';
        this.mouseDownEvent = 'mousedown';
        this.mouseUpEvent = 'mouseup';
        this.mouseLeaveEvent = 'mouseleave';
        this.timeoutTimeMs = 1000;
        this.intervalTimeMs = 50;

        // timeout is used to wait for hold time before start changing value and 
        // interval is used to change value fast while mouse button is hold 
        this.timeoutID = 0;
        this.intervalID = 0;

        let heightMeasures = questions[0].nextElementSibling.querySelectorAll('.measure');

        this.height = {
            question: questions[0],
            isValid: false,

            feet: {
                object: this.getMeasureElements(heightMeasures[0]),
                maximumValue: 7
            },

            inches: {
                object: this.getMeasureElements(heightMeasures[1]),
                maximumValue: 11
            }
        }

        let weightMeasure = questions[1].nextElementSibling;

        this.weight = {
            question: questions[1],
            isValid: false,

            pounds: {
                object: this.getMeasureElements(weightMeasure),
                maximumValue: 500
            },

            // fields for body mass and weight status
            bmi: {
                element: calculations[0],
                value: parseFloat(calculations[0].textContent)
            },

            weightStatus: {
                element: calculations[1],
                value: calculations[1].textContent,
            }
        }

        // body mass and weight status updates
        this.bmi = new BMI(this.height, this.weight);

        this.numberOfElements.all = 2;
    }

    // get minus / plus signs and number
    getMeasureElements(measure) {
        var signs = measure.querySelectorAll('.' + this.measureSignClass);
        var minusElement = signs[0], plusElement = signs[1];
        var numberElement = measure.querySelector('.measure__number');
        var numberInt = parseInt(numberElement.textContent);

        return {
            minus: minusElement,
            plus: plusElement,
            number: {
                element: numberElement,
                value: numberInt
            }
        }
    }

    initPage() {
        super.initPage();

        this.initMeasureElement(this.height.feet.object);
        this.initMeasureElement(this.height.inches.object);
        this.initMeasureElement(this.weight.pounds.object);
        this.weight.bmi.element.textContent = '0';
        this.weight.bmi.value = 0;
        this.weight.weightStatus.element.textContent = 'Not Calculated';

    }

    initMeasureElement(element) {
        // disable minus sign
        element.minus.classList.add(this.measureSignDisabledClass);

        element.number.element.textContent = '0';
        element.number.value = 0;

        // add event listeners to minus and plus buttons
        // when element is clicked, change value immediately
        element.minus.addEventListener(this.clickEvent, this.minusPlusClicked.bind(this));
        element.plus.addEventListener(this.clickEvent, this.minusPlusClicked.bind(this));

        // when click on element is hold enough with mousedown event, then change value fast
        // in short intervals (it's used as shorthand than clicking most of time) until click
        // is released with mouseup event or mouseleave event
        element.minus.addEventListener(this.mouseDownEvent, this.minusPlusHold.bind(this));
        element.minus.addEventListener(this.mouseUpEvent, this.minusPlusHold.bind(this));
        element.minus.addEventListener(this.mouseLeaveEvent, this.minusPlusHold.bind(this));
        element.plus.addEventListener(this.mouseDownEvent, this.minusPlusHold.bind(this));
        element.plus.addEventListener(this.mouseUpEvent, this.minusPlusHold.bind(this));
        element.plus.addEventListener(this.mouseLeaveEvent, this.minusPlusHold.bind(this));
    }

    minusPlusClicked(event) {
        event.preventDefault();

        var button = event.target;
        var isButton = button.classList.contains(this.measureSignClass);

        if (!isButton) button = button.parentElement;

        var buttonDisabled = button.classList.contains(this.measureSignDisabledClass);

        // if button is disabled, don't do anything else
        if (buttonDisabled) return;

        // detect feet, inches and pounds buttons
        this.detectButton(button, this.height.feet);
        this.detectButton(button, this.height.inches);
        this.detectButton(button, this.weight.pounds);

        this.bmi.updateBMIandWeightStatus();
    }

    // detect which button was clicked and do action
    detectButton(buttonClicked, buttonWrapper) {
        var object = buttonWrapper.object;
        var minusClicked = buttonClicked === object.minus;
        var plusClicked = buttonClicked === object.plus;
        var number = object.number;

        // decrement number
        if (minusClicked) this.minusIsClicked(number, buttonClicked, buttonWrapper);

        // increment number
        else if (plusClicked) this.plusIsClicked(number, buttonClicked, buttonWrapper);
    }

    minusIsClicked(number, buttonClicked, buttonWrapper) {
        number.value--;
        number.element.textContent = number.value;

        // disable minus button if zero is reached
        if (!number.value) buttonClicked.classList.add(this.measureSignDisabledClass);

        // if plus button is disabled, enable them
        else {
            let plusButton = buttonWrapper.object.plus;
            let plusButtonDisabled = plusButton.classList.contains(this.measureSignDisabledClass);

            if (plusButtonDisabled) plusButton.classList.remove(this.measureSignDisabledClass);
        }
    }

    plusIsClicked(number, buttonClicked, buttonWrapper) {
        // if current value is zero, than enable minus button after increment
        if (!number.value)
            buttonWrapper.object.minus.classList.remove(this.measureSignDisabledClass);

        number.value++;
        number.element.textContent = number.value;

        // if maximum valus is reached, then disable plus button
        if (number.value === buttonWrapper.maximumValue)
            buttonClicked.classList.add(this.measureSignDisabledClass);
    }

    // button is hold, after some time set timer interval to increment or decrement value fast
    // or if button is released, clear current timeout and timer interval for hold event
    minusPlusHold(event) {
        var buttonReleased = (event.type === this.mouseUpEvent) || (event.type === this.mouseLeaveEvent);

        if (buttonReleased) {
            clearTimeout(this.timeoutID);
            clearInterval(this.intervalID);
        }

        // button is pressed
        // bind this pointer to the handler function to not lose object and event object as argument
        else if (event.type === this.mouseDownEvent)
            this.timeoutID = setTimeout(this.timeoutExpires.bind(this, event), this.timeoutTimeMs);
    }

    // when button is hold enough, then set interval to fire fast changing of value
    timeoutExpires(event) {
        this.intervalID = setInterval(this.intervalExpires.bind(this, event), this.intervalTimeMs);
    }

    intervalExpires(event) {
        this.minusPlusClicked(event);
    }

    validatePage() {
        super.validatePage();

        this.pageValidation.validateHeight(this.height);
        this.pageValidation.validateWeight(this.weight);

        this.isPageValid(this.height.isValid, this.weight.isValid);
        this.updatePageIcon();
    }
}