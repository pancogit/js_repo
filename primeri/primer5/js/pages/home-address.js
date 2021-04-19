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

        this.removeErrorsFromPage();
    }

    removeErrorsFromPage() {
        super.removeErrorsFromPage();

        this.houseApartment.question.classList.remove(this.textErrorClass);
        this.country.question.classList.remove(this.textErrorClass);
        this.country.input.classList.remove(this.borderErrorClass);
        this.city.question.classList.remove(this.textErrorClass);
        this.city.input.classList.remove(this.borderErrorClass);
        this.address1.question.classList.remove(this.textErrorClass);
        this.address1.input.classList.remove(this.borderErrorClass);
        this.address2.question.classList.remove(this.textErrorClass);
        this.address2.input.classList.remove(this.borderErrorClass);
        this.state.question.classList.remove(this.textErrorClass);
        this.state.input.classList.remove(this.borderErrorClass);
        this.zip.question.classList.remove(this.textErrorClass);
        this.zip.input.classList.remove(this.borderErrorClass);
    }

    // page validation
    validatePage() {
        super.validatePage();

        this.pageValidation.validateRadioButtons(this.houseApartment, 
                                                 this.houseApartment.house, 
                                                 this.houseApartment.apartment);

        this.pageValidation.validateInput(this.country);
        this.pageValidation.validateInput(this.city);
        this.pageValidation.validateInput(this.address1);
        this.pageValidation.validateInput(this.address2);
        this.pageValidation.validateInput(this.state);
        this.pageValidation.validateZipCode(this.zip);

        this.isPageValid(this.houseApartment.isValid,
                         this.country.isValid,
                         this.city.isValid,
                         this.address1.isValid,
                         this.address2.isValid,
                         this.state.isValid,
                         this.zip.isValid);
                         
        this.updatePageIcon();
    }

    // update form data for form submission
    updateFormData() {
        super.updateFormData();

        if (this.houseApartment) {
            // set house or apartment string or empty string if no one is checked
            let houseApartmentString = this.houseApartment.house.checked ? 'house' : 
                                       this.houseApartment.apartment.checked ? 'apartment' : '';

            // set new form data key if it's not exist or update existing one
            this.formData.set('home address house/apartment', houseApartmentString);
        }
        
        this.formData.set('home address country', this.country.input.value);
        this.formData.set('home address city', this.city.input.value);
        this.formData.set('home address address 1', this.address1.input.value);
        this.formData.set('home address address 2', this.address2.input.value);
        this.formData.set('home address state', this.state.input.value);
        this.formData.set('home address zip', this.zip.input.value);
    }
}