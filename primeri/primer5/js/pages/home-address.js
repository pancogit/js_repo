// home address page


import { Page } from './page.js';

export class HomeAddress extends Page {

    constructor(pageObject, linkObject, iconObject) {
        super(pageObject, linkObject, iconObject);

        let questions = this.page.querySelectorAll('.home__question');

        this.houseApartment = {
            question: questions[0],
            house: this.page.querySelector('#house-id'),
            apartment: this.page.querySelector('#apartment-id'),
            isValid: false
        }

        this.country = {
            question: questions[1],
            input: questions[1].nextElementSibling,
            isValid: false
        }

        this.city = {
            question: questions[2],
            input: questions[2].nextElementSibling,
            isValid: false
        }

        this.address1 = {
            question: questions[3],
            input: questions[3].nextElementSibling,
            isValid: false
        }

        this.address2 = {
            question: questions[4],
            input: questions[4].nextElementSibling,
            isValid: false
        }

        this.state = {
            question: questions[5],
            input: questions[5].nextElementSibling,
            isValid: false
        }

        this.zip = {
            question: questions[6],
            input: questions[6].nextElementSibling,
            isValid: false
        }

        this.numberOfElements.all = 7;
    }

    // init all elements on page
    initPage() {
        super.initPage();

        this.houseApartment.house.checked = false;
        this.houseApartment.apartment.checked = false;
        this.country.input.value = '';
        this.city.input.value = '';
        this.address1.input.value = '';
        this.address2.input.value = '';
        this.state.input.value = '';
        this.zip.input.value = '';
    }

    // page validation
    validatePage() {
        super.validatePage();

        this.validateButtons(this.houseApartment.house, this.houseApartment.apartment);
        this.validateInputElement(this.country);
        this.validateInputElement(this.city);
        this.validateInputElement(this.address1);
        this.validateInputElement(this.address2);
        this.validateInputElement(this.state);
        this.validateInputElement(this.zip, true);

        this.isPageValid();
        this.updatePageIcon();
        this.updateNumberOfValidElements();
    }

    validateButtons(...buttons) {
        var isValid = this.validateRadioButtons(...buttons);

        if (isValid)
            this.houseApartment.question.classList.remove(this.textErrorClass);
        else
            this.houseApartment.question.classList.add(this.textErrorClass);

        // update valid flag
        this.houseApartment.isValid = isValid;
    }

    validateInputElement(inputElement, validateZip = false) {
        var isValid = validateZip ? this.validateZipCode(inputElement.input) :
            this.validateInput(inputElement.input);

        if (isValid) {
            inputElement.input.classList.remove(this.borderErrorClass);
            inputElement.question.classList.remove(this.textErrorClass);
        }
        else {
            inputElement.input.classList.add(this.borderErrorClass);
            inputElement.question.classList.add(this.textErrorClass);
        }

        // update valid flag
        inputElement.isValid = isValid;
    }

    // update valid flag for whole page
    isPageValid() {
        super.isPageValid();

        this.pageValid =
            this.houseApartment.isValid &&
            this.country.isValid        &&
            this.city.isValid           &&
            this.address1.isValid       &&
            this.address2.isValid       &&
            this.state.isValid          &&
            this.zip.isValid;
    }

    updateNumberOfValidElements() {
        this.numberOfElements.valid = 0;

        if (this.houseApartment.isValid) this.numberOfElements.valid++;
        if (this.country.isValid) this.numberOfElements.valid++;
        if (this.city.isValid) this.numberOfElements.valid++;
        if (this.address1.isValid) this.numberOfElements.valid++;
        if (this.address2.isValid) this.numberOfElements.valid++;
        if (this.state.isValid) this.numberOfElements.valid++;
        if (this.zip.isValid) this.numberOfElements.valid++;
    }
}