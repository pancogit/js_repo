// home address page


import { Page } from './page.js';

export class HomeAddress extends Page {

    constructor(pageObject, linkObject, iconObject) {
        super(pageObject, linkObject, iconObject);

        let questions = this.page.querySelectorAll('.home__question');

        this.houseApartment = {
            question: questions[0],
            house: this.page.querySelector('#house-id'),
            apartment: this.page.querySelector('#apartment-id')
        }

        this.country = {
            question: questions[1],
            input: questions[1].nextElementSibling
        }

        this.city = {
            question: questions[2],
            input: questions[2].nextElementSibling
        }

        this.address1 = {
            question: questions[3],
            input: questions[3].nextElementSibling
        }

        this.address2 = {
            question: questions[4],
            input: questions[4].nextElementSibling
        }

        this.state = {
            question: questions[5],
            input: questions[5].nextElementSibling
        }

        this.zip = {
            question: questions[6],
            input: questions[6].nextElementSibling
        }

        this.borderErrorClass = 'home__error-border';
        this.textErrorClass = 'home__error-text';
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

        this.validateInputElement(this.country);
        this.validateInputElement(this.city);
        this.validateInputElement(this.address1);
        this.validateInputElement(this.address2);
        this.validateInputElement(this.state);
    }

    validateInputElement(inputElement) {
        if (this.validateInput(inputElement.input)) {
            inputElement.input.classList.remove(this.borderErrorClass);
            inputElement.question.classList.remove(this.textErrorClass);
        }
        else {
            inputElement.input.classList.add(this.borderErrorClass);
            inputElement.question.classList.add(this.textErrorClass);
        }
    }
}