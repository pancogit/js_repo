// height and weight page


import { Page } from './page.js';

export class HeightWeight extends Page {

    constructor(pageObject, linkObject, iconObject) {
        super(pageObject, linkObject, iconObject);

        let questions = this.page.querySelectorAll('.home__question');
        let calculations = this.page.querySelectorAll('.calculation__content');
        this.measureSignClass = 'measure__sign';
        this.measureSignDisabledClass = 'measure__sign--disabled';

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
                value: calculations[1].textContent
            }
        }

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
        element.minus.addEventListener('click', this.minusPlusClicked.bind(this));
        element.plus.addEventListener('click', this.minusPlusClicked.bind(this));
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

    validatePage() {
        super.validatePage();

        this.isPageValid();
        this.updatePageIcon();
    }
}